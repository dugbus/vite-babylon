import{b as o,a as v}from"./vendor.b8b2ec9c.js";const g=function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))u(r);new MutationObserver(r=>{for(const t of r)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&u(n)}).observe(document,{childList:!0,subtree:!0});function s(r){const t={};return r.integrity&&(t.integrity=r.integrity),r.referrerpolicy&&(t.referrerPolicy=r.referrerpolicy),r.crossorigin==="use-credentials"?t.credentials="include":r.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function u(r){if(r.ep)return;r.ep=!0;const t=s(r);fetch(r.href,t)}};g();var x=document.getElementById("renderCanvas"),m=new o.exports.Engine(x,!0,{preserveDrawingBuffer:!0,stencil:!0});const p=(e,i)=>Math.floor(Math.random()*(i-e))+e;var c=[],y=function(){var e=new o.exports.Scene(m);e.clearColor=new o.exports.Color4(0,0,0,0);var i=new o.exports.ArcRotateCamera("Camera",-1.5,1.5,36,o.exports.Vector3.Zero(),e);i.attachControl(x,!0);var s=o.exports.BoxBuilder.CreateBox("box",{size:1},e),u=new o.exports.StandardMaterial("white",e);u.diffuseColor=o.exports.Color3.White(),s.material=u,s.registerInstancedBuffer("color",4),s.instancedBuffers.color=new o.exports.Color4(1,0,0,1),e.createDefaultLight();for(var r=1e3,t=0;t<r;t++){var n=s.createInstance("box"+t);c.push(n),n.position.x=p(-20,20),n.position.y=p(-20,20),n.position.z=p(0,100),n.velocity=p(1,15),n.metadata="box"+t,s.instancedBuffers.color=new o.exports.Color4(1,Math.random(),Math.random(),1)}e.onPointerObservable.add(d=>{switch(d.type){case o.exports.PointerEventTypes.POINTERDOWN:var f=d.pickInfo;if(f.hit){var l=f.pickedMesh;l&&(b(l),l.position.z=l.position.z+10)}break;case o.exports.PointerEventTypes.POINTERPICK:break}}),e.debugLayer.show({embedMode:!0});function b(d){let f=d.metadata,l=v.exports.AdvancedDynamicTexture.CreateFullscreenUI("UI"),a=v.exports.Button.CreateSimpleButton("guiButton",f);a.width="150px",a.height="40px",a.color="white",a.cornerRadius=5,a.background="green",a.onPointerUpObservable.add(function(){l.dispose()}),a.verticalAlignment=v.exports.Control.VERTICAL_ALIGNMENT_CENTER,l.addControl(a)}return e.createDefaultXRExperienceAsync(),e},h=y();m.runRenderLoop(function(){for(var e=0;e<c.length;e++)c[e].position.z=c[e].position.z-c[e].velocity/100,c[e].position.z<-50&&(c[e].position.z=200);h.render()});window.addEventListener("resize",function(){m.resize()});
