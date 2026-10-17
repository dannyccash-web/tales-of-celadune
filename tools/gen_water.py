"""Generate js/data/water.js (ambient water animation data).

Usage, from the project folder:   python3 tools/gen_water.py C1 C3 C4 D1 D2 D4
Needs numpy, scipy, scikit-image, Pillow and node. Water = blue-ish pixels of
the scene background that are ALSO blocked in the scene's collision. Scenes in
RIVERS get a downstream flow (toward where the river leaves the map, bottom
edge first, else left); every other scene is treated as still water.
"""
import json,numpy as np,base64,sys
from PIL import Image
from scipy import ndimage as nd
from skimage import measure, graph
import subprocess, os
ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..'))
U=os.path.join(ROOT,'assets','images')+'/'
S=5         # mask resolution (world px per mask cell)
FC=30       # flow-field cell (world px)
RIVERS={'C4','D4','B4'}
# Scenes whose OPEN SEA rolls in as waves (2026-10-13, Danny): every water
# component touching the map's WEST edge becomes 'wave' water — vertical lines
# drifting east toward the shore. Other components in those scenes (ponds,
# pools) stay still water.
SEAS={'C1','D1','B1'}
def load(sid):
    # Scene data modules are plain ES modules; let node print them as JSON.
    js=f"import('{ROOT}/js/data/{sid.lower()}.js').then(m=>process.stdout.write(JSON.stringify(m.default)))"
    return json.loads(subprocess.run(['node','--input-type=module','-e',js],capture_output=True,text=True,check=True).stdout)
def mask(sid,d):
    n=d['width']//S
    A=np.asarray(Image.open(U+f'{sid}_Background.jpg').convert('RGB').resize((n,n),Image.BILINEAR)).astype(int)
    r,g,b=A[...,0],A[...,1],A[...,2]
    w=(b>r+18)&(b>g-30)
    blk=np.zeros((n,n),bool)
    for o in d['obstacles']:
        if o.get('npcOnly'): continue
        blk[o['y']//S:-(-(o['y']+o['h'])//S), o['x']//S:-(-(o['x']+o['w'])//S)]=True
    w&=blk
    P=12; w=np.pad(w,P,mode='edge')
    w=nd.binary_opening(w,iterations=1); w=nd.binary_closing(w,iterations=2)
    w=w[P:-P,P:-P]
    lab,k=nd.label(w); sz=nd.sum(w,lab,range(1,k+1)); w=np.isin(lab,np.where(sz>=200)[0]+1)
    holes=nd.binary_fill_holes(w)&~w; hl,hn=nd.label(holes); hs=nd.sum(holes,hl,range(1,hn+1)); w|=np.isin(hl,np.where(hs<150)[0]+1)
    return w
def edt_padded(w):
    P=60; wp=np.pad(w,P,mode='edge'); e=nd.distance_transform_edt(wp)[P:-P,P:-P]; return e
def river_flow(w):
    n=w.shape[0]
    P=40; bridge=np.pad(w,P,mode='edge'); bridge=nd.binary_closing(bridge,iterations=18)[P:-P,P:-P]|w
    # sink: water cells on the bottom edge, else left edge
    sinks=[(n-1,x) for x in range(n) if bridge[n-1,x]] or [(y,0) for y in range(n) if bridge[y,0]]
    cost=np.where(w,1.0,np.where(bridge,3.0,40.0))  # land hops are allowed but expensive, so bridges/gaps don't strand a reach
    m=graph.MCP_Geometric(cost); dist,_=m.find_costs(sinks)
    dist[~np.isfinite(dist)]=np.nan
    dd=nd.gaussian_filter(np.nan_to_num(dist,nan=np.nanmax(dist)),3)
    gy,gx=np.gradient(dd); vx,vy=-gx,-gy
    nrm=np.hypot(vx,vy)+1e-9; vx/=nrm; vy/=nrm
    e=edt_padded(w)*S
    mag=0.5+0.5*np.clip(e/45,0,1)
    return vx*mag,vy*mag,len(sinks)
def still_flow(w):
    e=edt_padded(w)
    es=nd.gaussian_filter(e,4)
    gy,gx=np.gradient(es); vx,vy=-gy,gx   # tangent to the shore
    nrm=np.hypot(vx,vy)+1e-9; vx/=nrm; vy/=nrm
    mag=0.10+0.18*np.exp(-(e*S)/160)
    return vx*mag,vy*mag
def field(w,vx,vy,n_world,kind):
    N=n_world//FC; k=FC//S
    ww=w.reshape(N,k,N,k).mean((1,3))>0.5
    fx=vx.reshape(N,k,N,k).mean((1,3)); fy=vy.reshape(N,k,N,k).mean((1,3))
    fx[~ww]=0; fy[~ww]=0
    # keep water cells non-zero so they read as water
    small=ww&(np.hypot(fx,fy)<0.06)
    fx[small]=0.06
    kk=kind.reshape(N,k,N,k).max((1,3)).astype(np.int8); kk[~ww]=0
    q=np.stack([np.clip(np.round(fx*127),-127,127),np.clip(np.round(fy*127),-127,127),kk],-1).astype(np.int8)
    return N, base64.b64encode(q.tobytes()).decode(), int(ww.sum())
def shores(w):
    e=edt_padded(w)
    out=[]
    for lvl_px in (12,30):
        for c in measure.find_contours(e,lvl_px/S):
            if len(c)<8: continue
            c=measure.approximate_polygon(c,tolerance=0.8)
            pts=[]
            for (yy,xx) in c: pts+= [int(round(xx*S+S/2)), int(round(yy*S+S/2))]
            # split into chunks of <=40 points for culling
            for i in range(0,len(pts)//2,39):
                seg=pts[2*i:2*(i+40)]
                if len(seg)>=4: out.append([lvl_px,seg])
    return out
data={}
for sid in sys.argv[1:]:
    d=load(sid); w=mask(sid,d)
    if sid in RIVERS:
        vx,vy,ns=river_flow(w); sh=[]; kind='river'
    else:
        vx,vy=still_flow(w); sh=shores(w); kind='still'; ns=0
    K=np.where(w,1,0)            # 1 = flow-aligned streaks
    if sid in SEAS:
        lab,k=nd.label(w)
        sea=np.isin(lab,[l for l in np.unique(lab[:,0]) if l])
        e=edt_padded(w)*S
        mag=0.30+0.25*np.clip(e/180,0,1)   # waves slow and thin toward the shore
        vx=np.where(sea,mag,vx); vy=np.where(sea,0.0,vy)
        K=np.where(sea,2,K)       # 2 = waves (lines across the motion)
        kind+='+sea'
    N,b64,cells=field(w,vx,vy,d['width'],K)
    data[sid]={'cell':FC,'n':N,'field':b64,'shores':sh}
    print(sid,kind,'cells',cells,'sinks',ns,'shore chunks',len(sh),'b64',len(b64),'shore pts',sum(len(s[1]) for s in sh)//2)
HDR=["// GENERATED by tools/gen_water.py — ambient water animation data (see World.drawWater).",
"// One entry per overworld scene that has open water. Re-run the tool if a",
"// background is repainted; hand edits here will be overwritten.",
"//",
"//   cell   : flow-field cell size in world px",
"//   n      : field is n×n cells",
"//   field  : base64 Int8 triples (vx, vy, kind) per cell; vx,vy /127, kind 0 =",
"//            not water, 1 = streaks along the flow, 2 = sea waves (lines",
"//            ACROSS the flow, rolling east toward the shore).",
"//            Rivers point DOWNSTREAM (geodesic distance to where the river",
"//            leaves the map), fastest mid-channel. Still water (lakes, ponds,",
"//            sea) drifts gently ALONG the shore.",
"//   shores : [levelPx, [x0,y0,x1,y1,...]] shoreline contours, levelPx into the",
"//            water from the bank (12 = the foam line, 30 = the swell behind it).",
"export default {"]
for sid,w in data.items():
    HDR+=[f"  {sid}: {{",f"    cell: {w['cell']}, n: {w['n']},",f"    field: '{w['field']}',","    shores: ["]
    HDR+=[f"      [{lvl}, [{','.join(map(str,pts))}]]," for lvl,pts in w['shores']]
    HDR+=["    ],","  },"]
HDR.append("};")
open(os.path.join(ROOT,'js','data','water.js'),'w').write('\n'.join(HDR)+'\n')
