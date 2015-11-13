/*!
 * 올레맵 JavaScript API v3.0.x
 * (c) 2013 kt corp.
 */
document.write();if(!olleh.maps.Function){olleh.maps.Function={bind:function(c,b){var a=Array.prototype.slice.apply(arguments,[2]);return function(){var d=a.concat(Array.prototype.slice.apply(arguments,[0]));return c.apply(b,d)}}}};$class("olleh.maps.GeoFormat").define({options:null,data:null,keepData:false,GeoFormat:function(a){olleh.maps.mixin(this,a);this.options=a},destroy:function(){},read:function(a){},write:function(a){}});$class("olleh.maps.geoformat.XML").extend(olleh.maps.GeoFormat).define({namespaces:null,namespaceAlias:null,defaultPrefix:null,readers:{},writers:{},xmldom:null,XML:function(a){olleh.maps.util.copyOpts(this,a);if(window.ActiveXObject){this.xmldom=new ActiveXObject("Microsoft.XMLDOM")}this.namespaces=olleh.maps.mixin({},this.namespaces);this.namespaceAlias={};for(var b in this.namespaces){this.namespaceAlias[this.namespaces[b]]=b}},read:function(c){var a=c.indexOf("<");if(a>0){c=c.substring(a)}var b=olleh.maps.geoformat.XML.Try(olleh.maps.Function.bind((function(){var d;if(window.ActiveXObject&&!this.xmldom){d=new ActiveXObject("Microsoft.XMLDOM")}else{d=this.xmldom}d.loadXML(c);return d}),this),function(){return new DOMParser().parseFromString(c,"text/xml")},function(){var d=new XMLHttpRequest();d.open("GET","data:text/xml;charset=utf-8,"+encodeURIComponent(c),false);if(d.overrideMimeType){d.overrideMimeType("text/xml")}d.send(null);return d.responseXML});if(this.keepData){this.data=b}return b},write:function(b){var c;if(this.xmldom){c=b.xml}else{var a=new XMLSerializer();if(b.nodeType==1){var d=document.implementation.createDocument("","",null);if(d.importNode){b=d.importNode(b,true)}d.appendChild(b);c=a.serializeToString(d)}else{c=a.serializeToString(b)}}return c},writeNode:function(b,a,e){var f,d;var c=b.indexOf(":");if(c>0){f=b.substring(0,c);d=b.substring(c+1)}else{if(e){f=this.namespaceAlias[e.namespaceURI]}else{f=this.defaultPrefix}d=b}var g=this.writers[f][d].apply(this,[a]);if(e){e.appendChild(g)}return g},createElementNS:function(c,a){var b;if(this.xmldom){if(typeof c=="string"){b=this.xmldom.createNode(1,a,c)}else{b=this.xmldom.createNode(1,a,"")}}else{b=document.createElementNS(c,a)}return b},createDocumentFragment:function(){var a;if(this.xmldom){a=this.xmldom.createDocumentFragment()}else{a=document.createDocumentFragment()}return a},createTextNode:function(b){var a;if(typeof b!=="string"){b=String(b)}if(this.xmldom){a=this.xmldom.createTextNode(b)}else{a=document.createTextNode(b)}return a},getElementsByTagNameNS:function(e,d,c){var a=[];if(e.getElementsByTagNameNS){a=e.getElementsByTagNameNS(d,c)}else{var b=e.getElementsByTagName("*");var j,f;for(var g=0,h=b.length;g<h;++g){j=b[g];f=(j.prefix)?(j.prefix+":"+c):c;if((c=="*")||(f==j.nodeName)){if((d=="*")||(d==j.namespaceURI)){a.push(j)}}}}return a},getAttributeNodeNS:function(c,b,a){var j=null;if(c.getAttributeNodeNS){j=c.getAttributeNodeNS(b,a)}else{var e=c.attributes;var h,d;for(var f=0,g=e.length;f<g;++f){h=e[f];if(h.namespaceURI==b){d=(h.prefix)?(h.prefix+":"+a):a;if(d==h.nodeName){j=h;break}}}}return j},getAttributeNS:function(e,d,a){var b="";if(e.getAttributeNS){b=e.getAttributeNS(d,a)||""}else{var c=this.getAttributeNodeNS(e,d,a);if(c){b=c.nodeValue}}return b},createElementNSPlus:function(b,a){a=a||{};var d=a.uri||this.namespaces[a.prefix];if(!d){var f=b.indexOf(":");d=this.namespaces[b.substring(0,f)]}if(!d){d=this.namespaces[this.defaultPrefix]}var c=this.createElementNS(d,b);if(a.attributes){this.setAttributes(c,a.attributes)}var e=a.value;if(e!=null){c.appendChild(this.createTextNode(e))}return c},setAttributes:function(c,e){var d,b;for(var a in e){if(e[a]!=null&&e[a].toString){d=e[a].toString();b=this.namespaces[a.substring(0,a.indexOf(":"))]||null;this.setAttributeNS(c,b,a,d)}}},hasAttributeNS:function(c,b,a){var d=false;if(c.hasAttributeNS){d=c.hasAttributeNS(b,a)}else{d=!!this.getAttributeNodeNS(c,b,a)}return d},setAttributeNS:function(d,c,a,e){if(d.setAttributeNS){d.setAttributeNS(c,a,e)}else{if(this.xmldom){if(c){var b=d.ownerDocument.createNode(2,a,c);b.nodeValue=e;d.setAttributeNode(b)}else{d.setAttribute(a,e)}}else{throw"setAttributeNS not implemented"}}},setNamespace:function(a,b){this.namespaces[a]=b;this.namespaceAlias[b]=a},readNode:function(c,e){if(!e){e={}}var d=this.readers[c.namespaceURI?this.namespaceAlias[c.namespaceURI]:this.defaultPrefix];if(d){var b=c.localName||c.nodeName.split(":").pop();var a=d[b]||d["*"];if(a){a.apply(this,[c,e])}}return e},readChildNodes:function(d,e){if(!e){e={}}var c=d.childNodes;var f;for(var b=0,a=c.length;b<a;++b){f=c[b];if(f.nodeType==1){this.readNode(f,e)}}return e},getChildValue:function(a,c){var b=c||"";if(a){for(var d=a.firstChild;d;d=d.nextSibling){switch(d.nodeType){case 3:case 4:b+=d.nodeValue}}}return b},isSimpleContent:function(a){var c=true;for(var b=a.firstChild;b;b=b.nextSibling){if(b.nodeType===1){c=false;break}}return c},contentType:function(c){var e=false,b=false;var a=olleh.maps.geoformat.XML.CONTENT_TYPE.EMPTY;for(var d=c.firstChild;d;d=d.nextSibling){switch(d.nodeType){case 1:b=true;break;case 8:break;default:e=true}if(b&&e){break}}if(b&&e){a=olleh.maps.geoformat.XML.CONTENT_TYPE.MIXED}else{if(b){return olleh.maps.geoformat.XML.CONTENT_TYPE.COMPLEX}else{if(e){return olleh.maps.geoformat.XML.CONTENT_TYPE.SIMPLE}}}return a},lookupNamespaceURI:function(e,f){var d=null;if(e){if(e.lookupNamespaceURI){d=e.lookupNamespaceURI(f)}else{outer:switch(e.nodeType){case 1:if(e.namespaceURI!==null&&e.prefix===f){d=e.namespaceURI;break outer}var b=e.attributes.length;if(b){var a;for(var c=0;c<b;++c){a=e.attributes[c];if(a.prefix==="xmlns"&&a.name==="xmlns:"+f){d=a.value||null;break outer}else{if(a.name==="xmlns"&&f===null){d=a.value||null;break outer}}}}d=this.lookupNamespaceURI(e.parentNode,f);break outer;case 2:d=this.lookupNamespaceURI(e.ownerElement,f);break outer;case 9:d=this.lookupNamespaceURI(e.documentElement,f);break outer;case 6:case 12:case 10:case 11:break outer;default:d=this.lookupNamespaceURI(e.parentNode,f);break outer}}}return d},getXMLDoc:function(){if(!olleh.maps.geoformat.XML.document&&!this.xmldom){if(document.implementation&&document.implementation.createDocument){olleh.maps.geoformat.XML.document=document.implementation.createDocument("","",null)}else{if(!this.xmldom&&window.ActiveXObject){this.xmldom=new ActiveXObject("Microsoft.XMLDOM")}}}return olleh.maps.geoformat.XML.document||this.xmldom},});olleh.maps.geoformat.XML.CONTENT_TYPE={EMPTY:0,SIMPLE:1,COMPLEX:2,MIXED:3};olleh.maps.geoformat.XML.Try=function(){var d=null;for(var c=0,a=arguments.length;c<a;c++){var b=arguments[c];try{d=b();break}catch(f){}}return d};olleh.maps.geoformat.XML.getXmlNodeValue=function(a){var b=null;olleh.maps.geoformat.XML.Try(function(){b=a.text;if(!b){b=a.textContent}if(!b){b=a.firstChild.nodeValue}},function(){b=a.textContent});return b};$class("olleh.maps.Geocoder").define({baseURL:"http://map.ktgis.com/MapAPI",key:null,scriptTag:null,Geocoder:function(a){this.key=a?a:null},geocode:function(e,i){if(e.type==0){var f=(e.addr)?e.addr:null;var d=(e.addrcdtype)?e.addrcdtype:null;url=this.baseURL+"/serviceJSP/Geocoder.jsp?key="+this.key+"&reqtype="+e.type+"&addr="+f+"&callback="+i;if(d){url+="&addrcdtype="+d}}else{if(e.type==1){var h=(e.x)?e.x:null;var g=(e.y)?e.y:null;var c=(e.isMPoi)?e.isMPoi:null;var d=(e.addrcdtype)?e.addrcdtype:null;var b=(e.newAddr)?e.newAddr:null;var a=(e.isJibun)?e.isJibun:null;url=this.baseURL+"/serviceJSP/Geocoder.jsp?key="+this.key+"&reqtype="+e.type+"&x="+h+"&y="+g+"&callback="+i;if(c){url+="&isMPoi="+c}if(d){url+="&addrcdtype="+d}if(b){url+="&newAddr="+b}if(a){url+="&isJibun="+a}}}this.scriptTag=document.createElement("script");this.scriptTag.setAttribute("type","text/javascript");this.scriptTag.setAttribute("src",url);document.getElementsByTagName("head")[0].appendChild(this.scriptTag)},parseGeocode:function(C){if(this.scriptTag){var e=document.getElementsByTagName("head")[0];if(e.childNodes[e.childNodes.length-1]==this.scriptTag){document.getElementsByTagName("head")[0].removeChild(this.scriptTag)}this.scriptTag=null}var v=new olleh.maps.geoformat.XML();var d=v.read(C);var p=d.getElementsByTagName("ID")[0].firstChild.nodeValue;var A=d.getElementsByTagName("ERRCD")[0].firstChild.nodeValue;var b=d.getElementsByTagName("NO")[0].firstChild.nodeValue;var a=d.getElementsByTagName("ERRMS")[0].firstChild.nodeValue;if(A==0){var g,o;if(d.getElementsByTagName("POI_COUNT")[0]&&d.getElementsByTagName("POI_COUNT")[0].firstChild.nodeValue){o=parseInt(d.getElementsByTagName("POI_COUNT")[0].firstChild.nodeValue)}g=parseInt(d.getElementsByTagName("COUNT")[0].firstChild.nodeValue);if(o>0){var y=d.getElementsByTagName("POI")[0].getElementsByTagName("DATAS")[0];var h=d.getElementsByTagName("ADDRS")[0].getElementsByTagName("DATAS")[0];var l=y.childNodes;var n=h.childNodes;var f=new Array(g);var c=new Array(o);for(var s=0;s<g;s++){var u=n[s].childNodes;var z={};for(var t=0;t<u.length;t++){var w=u[t].nodeName;var x="no value";if(u[t].firstChild){x=u[t].firstChild.nodeValue}z[w.toLowerCase()]=x}f[s]=z}for(var r=0;r<o;r++){var B=l[r].childNodes;var z={};for(var q=0;q<B.length;q++){var w=B[q].nodeName;var x="no value";if(B[q].firstChild){x=B[q].firstChild.nodeValue}z[w.toLowerCase()]=x}c[r]=z}return{id:p,errcd:A,no:b,errms:a,count:g,infoarr:f,poicount:o,poiarr:c}}else{if(g>0&&!(o>0)){var y=d.getElementsByTagName("DATAS")[0];var l=y.childNodes;var f=new Array(g);for(var t=0;t<g;t++){var B=l[t].childNodes;var z={};for(var s=0;s<B.length;s++){var w=B[s].nodeName;var x="no value";if(B[s].firstChild){x=B[s].firstChild.nodeValue}z[w.toLowerCase()]=x}f[t]=z}return{id:p,errcd:A,no:b,errms:a,count:g,infoarr:f}}else{return{id:p,errcd:A,no:b,errms:a,count:g,infoarr:null}}}}else{return{id:p,errcd:A,no:b,errms:a}}}});$class("olleh.maps.DirectionsService").define({baseURL:"http://map.ktgis.com/MapAPI",key:null,destination:null,origin:null,projection:null,travelMode:null,priority:null,waypoints:null,scriptTag:null,DirectionsService:function(a){this.key=a?a:null},route:function(e,g){if(e.destination){if(e.destination&&e.destination.$classname=="olleh.maps.UTMK"){this.destination=e.destination}else{throw new Error("destination is not olleh.maps.UTMK type")}}else{throw new Error("destination is undefined")}if(e.origin){if(e.origin.$classname=="olleh.maps.UTMK"){this.origin=e.origin}else{throw new Error("origin is not olleh.maps.UTMK type")}}else{throw new Error("origin is undefined")}this.projection=(e.projection)?""+e.projection:"7";if(e.travelMode){this.travelMode=e.travelMode}else{throw new Error("travelMode is undefined")}this.priority=(e.priority||e.priority=="0")?""+e.priority:null;this.waypoints=(e.waypoints&&olleh.maps.isArray(e.waypoints))?e.waypoints:null;var f="";if(this.key){f+="&key="+this.key}if(this.origin){f+="&SX="+this.origin.x;f+="&SY="+this.origin.y}if(this.destination){f+="&EX="+this.destination.x;f+="&EY="+this.destination.y}if(this.travelMode){var c=-1;switch(this.travelMode){case olleh.maps.DirectionsTravelMode.DRIVING:c=0;break;case olleh.maps.DirectionsTravelMode.TRAFFIC:c=1;break}f+="&RPTYPE="+c}f+="&COORDTYPE="+this.projection;if(this.travelMode!=olleh.maps.DirectionsTravelMode.TRAFFIC&&this.waypoints!=null&&this.waypoints.length>0){for(var d=0,b=this.waypoints.length;d<b;d++){if(this.waypoints[d].$classname=="olleh.maps.UTMK"){f+="&VX"+(d+1)+"="+this.waypoints[d].x;f+="&VY"+(d+1)+"="+this.waypoints[d].y;if(d==2){break}}}}if(this.priority!=null){f+="&PRIORITY="+this.priority}var a=this.baseURL+"/serviceJSP/DirectionsService.jsp?callback="+g+f;this.scriptTag=document.createElement("script");this.scriptTag.setAttribute("type","text/javascript");this.scriptTag.setAttribute("src",a);document.getElementsByTagName("head")[0].appendChild(this.scriptTag)},parseRoute:function(w){if(this.scriptTag){var B=document.getElementsByTagName("head")[0];if(B.childNodes[B.childNodes.length-1]==this.scriptTag){document.getElementsByTagName("head")[0].removeChild(this.scriptTag)}this.scriptTag=null}if(w&&w.error){return{id:"",errcd:-1,no:"",errms:"server error:"+w.error}}var o=new olleh.maps.geoformat.XML();var aC=o.read(w);var U=aC.getElementsByTagName("ID")[0].firstChild.nodeValue;var ax=aC.getElementsByTagName("ERRCD")[0].firstChild.nodeValue;var ag=aC.getElementsByTagName("NO")[0].firstChild.nodeValue;var d=aC.getElementsByTagName("ERRMS")[0].firstChild.nodeValue;if(ax==0){var ao=aC.getElementsByTagName("isRoute")[0].firstChild.nodeValue;if(ao=="true"){var au=(aC.getElementsByTagName("SROUTE")[0]!=null)?"DRIVING":"TRAFFIC";if(au=="DRIVING"){var av={routes:[],links:[],link_version:null,bounds:null,projection:null,total_distance:null,total_duration:null};var aB=aC.getElementsByTagName("coordtype")[0].firstChild.nodeValue;var Z=aC.getElementsByTagName("link_ver")[0].firstChild.nodeValue;var aK=aC.getElementsByTagName("mbr_maxx")[0].firstChild.nodeValue;var aJ=aC.getElementsByTagName("mbr_maxy")[0].firstChild.nodeValue;var G=aC.getElementsByTagName("mbr_minx")[0].firstChild.nodeValue;var F=aC.getElementsByTagName("mbr_miny")[0].firstChild.nodeValue;av.projection=aB;av.link_version=Z;av.bounds=new olleh.maps.Bounds(new olleh.maps.UTMK(G,F),new olleh.maps.UTMK(aK,aJ));var E=aC.getElementsByTagName("link")[0].childNodes[0].childNodes;for(var X=0,W=E.length;X<W;X++){var az=E[X];var aN=az.getElementsByTagName("vertex")[0].getElementsByTagName("DATA");for(var V=0;V<aN.length;V++){var C=aN[V];var J=C.getElementsByTagName("x")[0].firstChild.nodeValue;var I=C.getElementsByTagName("y")[0].firstChild.nodeValue;av.links.push(new olleh.maps.UTMK(J,I))}}var M=aC.getElementsByTagName("ROUTE")[0];var s=M.getElementsByTagName("total_dist")[0].firstChild.nodeValue;var ap=M.getElementsByTagName("total_time")[0].firstChild.nodeValue;var aq={text:s+"m",value:Number(s)};var ak={text:ap+"분",value:Number(ap)};av.total_distance=aq;av.total_duration=ak;var h=M.getElementsByTagName("rg")[0].getElementsByTagName("DATA");for(var X=0,W=h.length;X<W;X++){var aI=h[X];var aO=aI.getElementsByTagName("link_idx")[0].firstChild.nodeValue;var K=((aI.getElementsByTagName("dir_name")[0].hasChildNodes()))?aI.getElementsByTagName("dir_name")[0].firstChild.nodeValue:"";var v=aI.getElementsByTagName("nextdist")[0].firstChild.nodeValue;var ae=aI.getElementsByTagName("type")[0].firstChild.nodeValue;var aG=((aI.getElementsByTagName("node_name")[0].hasChildNodes()))?aI.getElementsByTagName("node_name")[0].firstChild.nodeValue:"";var J=aI.getElementsByTagName("x")[0].firstChild.nodeValue;var I=aI.getElementsByTagName("y")[0].firstChild.nodeValue;var g={link_idx:Number(aO),dir_name:K,nextdist:Number(v),type:ae,node_name:aG,point:new olleh.maps.UTMK(J,I)};av.routes.push(g)}}else{if(au=="TRAFFIC"){var av=[];var S=aC.getElementsByTagName("PROUTE")[0].getElementsByTagName("DATA")[0].childNodes;for(var X=0,W=S.length;X<W;X++){if(S[X].nodeName=="isRoute"){continue}var b=S[X];var aw={type:b.nodeName,result:[],result_count:Number(b.getElementsByTagName("resultcount")[0].firstChild.nodeValue)};var am=b.getElementsByTagName("RESULT")[0].getElementsByTagName("DATAS")[0].childNodes;for(var Q=0;Q<am.length;Q++){var l=am[Q];var a=l.getElementsByTagName("no")[0].firstChild.nodeValue;var aH=l.getElementsByTagName("ROUTE")[0];var af=aH.getElementsByTagName("charge")[0].firstChild.nodeValue;var ar=aH.getElementsByTagName("totaldistance")[0].firstChild.nodeValue;var ay=aH.getElementsByTagName("totaltime")[0].firstChild.nodeValue;var R=aH.getElementsByTagName("subwaynum")[0].firstChild.nodeValue;var u=aH.getElementsByTagName("busnum")[0].firstChild.nodeValue;var aq={text:ar+"m",value:Number(ar)};var ak={text:ay+"분",value:Number(ay)};var an={display_bounds:null,display_projection:null,methods:[],no:Number(a),routes:[],route_buscount:Number(u),route_charge:af,route_subwaycount:Number(R),route_totaldistance:aq,route_totalduration:ak,stations:{},type:b.nodeName};var c=aH.getElementsByTagName("RG")[0].getElementsByTagName("DATA");for(var V=0;V<c.length;V++){var P=c[V];var Y=P.getElementsByTagName("distance")[0].firstChild.nodeValue;var aE=P.getElementsByTagName("rgtype")[0].firstChild.nodeValue;var ah=P.getElementsByTagName("methodtype")[0].firstChild.nodeValue;var e=P.getElementsByTagName("distancetype")[0].firstChild.nodeValue;var r=P.getElementsByTagName("startname")[0].firstChild.nodeValue;var aA=P.getElementsByTagName("lanename")[0].firstChild.nodeValue;var aD=(P.getElementsByTagName("endname")[0].hasChildNodes())?P.getElementsByTagName("endname")[0].firstChild.nodeValue:"";var J=P.getElementsByTagName("x")[0].firstChild.nodeValue;var I=P.getElementsByTagName("y")[0].firstChild.nodeValue;var D={distance:Number(Y),rgtype:aE,methodtype:ah,distancetype:e,startname:r,lanename:aA,endname:aD,point:new olleh.maps.UTMK(J,I)};an.routes.push(D)}var A=l.getElementsByTagName("DISPLAY")[0];var z=A.getElementsByTagName("methodcount")[0].firstChild.nodeValue;var H=A.getElementsByTagName("mbr_xmin")[0].firstChild.nodeValue;var N=A.getElementsByTagName("mbr_ymin")[0].firstChild.nodeValue;var ai=A.getElementsByTagName("mbr_xmax")[0].firstChild.nodeValue;var al=A.getElementsByTagName("mbr_ymax")[0].firstChild.nodeValue;var aB=A.getElementsByTagName("coordtype")[0].firstChild.nodeValue;an.display_bounds=new olleh.maps.Bounds(new olleh.maps.UTMK(H,N),new olleh.maps.UTMK(ai,al));an.display_projection=aB;var ab=A.getElementsByTagName("stationcount")[0].firstChild.nodeValue;var aL=A.getElementsByTagName("STATION")[0].getElementsByTagName("NODE")[0].getElementsByTagName("DATA");var T={stationcount:Number(ab),stationdata:[]};for(var O=0;O<aL.length;O++){var ad=aL[O];var aj=ad.getElementsByTagName("name")[0].firstChild.nodeValue;var J=ad.getElementsByTagName("x")[0].firstChild.nodeValue;var I=ad.getElementsByTagName("y")[0].firstChild.nodeValue;var at=ad.getElementsByTagName("stationtype")[0].firstChild.nodeValue;var n={point:new olleh.maps.UTMK(J,I),name:aj,type:at};T.stationdata.push(n)}an.stations=T;var ac=A.getElementsByTagName("METHOD")[0].childNodes[0].childNodes;for(var aa=0;aa<ac.length;aa++){var m=ac[aa];var L=m.getElementsByTagName("vertexcount")[0].firstChild.nodeValue;var ae=m.getElementsByTagName("type")[0].firstChild.nodeValue;var aF=m.getElementsByTagName("VERTEX")[0].getElementsByTagName("DATA");var aM={points:[],type:ae,vertexcount:Number(L)};for(var O=0;O<aF.length;O++){var t=aF[O];var J=t.getElementsByTagName("x")[0].firstChild.nodeValue;var I=t.getElementsByTagName("y")[0].firstChild.nodeValue;aM.points.push(new olleh.maps.UTMK(J,I))}an.methods.push(aM)}aw.result.push(an)}av.push(aw)}}}return{id:U,errcd:ax,no:ag,errms:d,result:av}}else{return{id:U,errcd:ax,no:ag,errms:"isRoute is false",result:null}}}return{id:U,errcd:ax,no:ag,errms:d,result:null}}});olleh.maps.DirectionsTravelMode={DRIVING:"DRIVING",TRAFFIC:"TRAFFIC"};olleh.maps.DirectionsProjection={Geographic:"0",TM_WEST:"1",TM_MID:"2",TM_EAST:"3",KATEC:"4",UTM_52:"5",UTM_51:"6",UTM_K:"7"};olleh.maps.DirectionsTrafficType={RECOMMEND:"RECOMMEND",BUS:"BUS",SUBWAY:"SUBWAY",BOTH:"BOTH"};olleh.maps.DirectionsDrivePriority={PRIORITY_0:"0",PRIORITY_1:"1",PRIORITY_2:"2",PRIORITY_3:"3",PRIORITY_4:"5"};olleh.maps.DirecionsTrafficPriority={PRIORITY_0:"0",PRIORITY_1:"1",PRIORITY_2:"2",PRIORITY_3:"3"};$class("olleh.maps.DirectionsRenderer").define({directions:null,map:null,markerOptions:null,polylineOptions:null,keepView:true,offMarkers:false,offPolylines:false,resultIndex:0,travelMode:null,links:null,markers:null,curTrraficSort:"RECOMMEND",trraficResultIndex:0,event:(olleh.maps.browser.isMobile)?"touchend":"click",imageURL:"http://map.ktgis.com/MapAPI/images/",DirectionsRenderer:function(a){this.markerOptions={};this.polylineOptions={};this.markers=[];this.links=[];if(a.map){this.map=a.map}if(a.markerOptions){this.markerOptions=a.markerOptions}if(!this.markerOptions.map){this.markerOptions.map=this.map}if(a.polylineOptions){this.polylineOptions=a.polylineOptions}if(a.keepView!=null){this.keepView=a.keepView}if(a.offMarkers!=null){this.offMarkers=a.offMarkers}if(a.offPolylines!=null){this.offPolylines=a.offPolylines}if(a.directions){this.directions=a.directions}},getIndex:function(c){if(this.travelMode=="TRAFFIC"){var d=this.directions.result;for(var b=0,a=d.length;b<a;b++){if(d[b].type==c){return d[b].result_count}}return 0}else{return null}},setIndex:function(b,a){if(this.travelMode=="TRAFFIC"){this.curTrraficSort=b;this.trraficResultIndex=Number(a)}},getRecommendCount:function(){return this.getIndex("RECOMMEND")},setRecommendIndex:function(a){this.setIndex("RECOMMEND",a)},getBothCount:function(){return this.getIndex("BOTH")},setBothIndex:function(a){this.setIndex("BOTH",a)},getBusCount:function(){return this.getIndex("BUS")},setBusIndex:function(a){this.setIndex("BUS",a)},getSubwayCount:function(){return this.getIndex("SUBWAY")},setSubwayIndex:function(a){this.setIndex("SUBWAY",a)},getDirections:function(){return this.directions},getMap:function(){return this.map},removeDirections:function(){this.linksSetMap(null);for(var b=0,a=this.markers.length;b<a;b++){if(this.markers[b].refer){this.markers[b].refer.direction=null;this.markers[b].refer.infoWin=null;this.markers[b].refer=null}this.markers[b].setMap(null)}this.markers.length=0},setDirections:function(a){this.directions=a;if(this.getMap()){this.removeDirections()}this.setMap(this.map)},setMap:function(a){if(a==null){this.removeDirections();this.map=null}else{if(this.getMap()){this.setMap(null)}this.map=a;if(this.directions&&this.directions.result){var o=this.directions.result;var p=null;for(var l=0,h=o.length;l<h;l++){if(o[l].type){p=o[l].type;if(p=="BOTH"||p=="BUS"||p=="RECOMMEND"||p=="SUBWAY"){p="TRAFFIC";break}}}this.travelMode=(p)?p:"DRIVING";if(this.offMarkers){this.markerOptions.visible=false}else{this.markerOptions.visible=true}var r=(this.markerOptions.title)?this.markerOptions.title:"";var q=(this.markerOptions.zIndex)?Number(this.markerOptions.zIndex):0;var b=olleh.maps.mixin({},this.markerOptions);if(!this.polylineOptions.strokeColor){this.polylineOptions.strokeColor="#ff3131"}if(!this.polylineOptions.strokeWeight){this.polylineOptions.strokeWeight=5}if(this.travelMode=="DRIVING"){if(o.links){this.polylineOptions.path=o.links;this.drawLinks(a);if(this.keepView){if(this.directions.result.bounds){this.map.fitBounds(this.directions.result.bounds)}}}if(o.routes){this.drawRgs(this.markers,this.directions.result,b,r,q)}}else{if(this.travelMode=="TRAFFIC"){var e=null;var n=true;for(var l=0,h=o.length;l<h;l++){if(o[l].type!=this.curTrraficSort){continue}for(var f=0;f<o[l].result.length;f++){var g=o[l].result[f];if(f!=this.trraficResultIndex){continue}var c=g.display_bounds;if(n){e=c;n=false}if(e.left>c.left){e.left=c.left}if(e.bottom>c.bottom){e.bottom=c.bottom}if(e.right<c.right){e.right=c.right}if(e.top<c.top){e.top=c.top}this.drawRgs(this.markers,g,b,r,q);for(var d=0;d<g.methods.length;d++){this.polylineOptions.path=g.methods[d].points;this.drawLinks(a)}}}if(e&&!this.offPolylines){if(this.keepView){this.map.fitBounds(e)}}}}}}},linksSetMap:function(c){for(var b=0,a=this.links.length;b<a;b++){this.links[b].setMap(c)}if(c==null){this.links.length=0}},drawLinks:function(b){var a=olleh.maps.util.clone(this.polylineOptions);delete a.path;a.path=new olleh.maps.Path(this.polylineOptions.path);this.links.push(new olleh.maps.vector.Polyline(a));if(this.offPolylines){this.linksSetMap(null)}else{this.linksSetMap(b)}},getContent:function(r,m,k,l){var d=m[k];var n="";var t="";var b='"color:#767676;padding-right:12px;vertical-align:top;white-space:nowrap"';var i='"font-family: dotum, arial, sans-serif;font-size: 18px; font-weight: bold;margin-bottom: 5px;"';if(r=="DRIVING"){var p=(d.node_name!="")?d.node_name:"정보없음";var q=this.getRgTypeStr(d.type);var s="";var c="";if(q=="출발지"||q=="경유지"||q=="도착지"){t=q;if(q!="경유지"){s=this.directions.result.total_duration.text;c=this.directions.result.total_distance.text}}else{t=p}n+="<div style="+i+">"+t+"</div>";var f=(d.dir_name!="")?d.dir_name:"정보없음";n+='<table class="ts" style="border-spacing: 2px; border: 0px"><tbody>';n+="<tr><td style="+b+">방면정보</td><td><span>"+f+"</span></td><tr>";n+="<tr><td style="+b+">구간거리</td><td><span>"+d.nextdist+"m</span></td><tr>";n+="<tr><td style="+b+">이정표</td><td><span>"+q+"</span></td><tr>";if(c!=""){n+="<tr><td style="+b+">총거리</td><td><span>"+c+"</span></td><tr>"}if(s!=""){n+="<tr><td style="+b+">총시간</td><td><span>"+s+"</span></td><tr>"}}else{if(this.travelMode=="TRAFFIC"){if(d.startname){t=d.startname+"/"}if(d.endname){t+=d.endname}n+="<div style="+i+">"+t+"</div>";if(d.rgtype){var a="";var j="";var e="";if(d.distance&&d.distance!=""){e=d.distance;if(d.rgtype=="1"||d.rgtype=="2"||d.rgtype=="4"){e+=" 개"}else{if(d.rgtype=="3"){e+="m"}}}else{e="정보없음"}var g="";if(d.rgtype=="1"){var g=this.getMethodtypeStr(d.methodtype);j=d.lanename+" "+g;a="정거장갯수"}else{if(d.rgtype=="2"){j=d.lanename+" 지하철";a="정거장갯수"}else{if(d.rgtype=="3"){j="도보";if(d.distance){a="구간거리"}}else{if(d.rgtype=="4"){var o="";var h=k;while(o=="4"){h--;o=m[h-1].rgtype}if(o=="1"){j=d.lanename+"노선 버스 환승"}else{if(o=="2"){j=d.lanename+" 지하철 환승"}else{j=d.lanename+" 환승"}}a="정거장갯수"}}}}n+='<table class="ts" style="border-spacing: 2px; border: 0px"><tbody>';n+="<tr><td style="+b+">이동수단</td><td><span>"+j+"</span></td><tr>";n+="<tr><td style="+b+">"+a+"</td><td><span>"+e+"</span></td><tr>";if(k==0||(m.length-1)==k){n+="<tr><td style="+b+">발생요금</td><td><span>"+l.route_charge+"</span></td><tr>";n+="<tr><td style="+b+">총거리</td><td><span>"+l.route_totaldistance.text+"</span></td><tr>";n+="<tr><td style="+b+">총시간</td><td><span>"+l.route_totalduration.text+"</span></td><tr>";n+="<tr><td style="+b+">버스 이용횟수</td><td><span>"+l.route_buscount+"</span></td><tr>";n+="<tr><td style="+b+">지하철 이용횟수</td><td><span>"+l.route_subwaycount+"</span></td><tr>"}}}}n+="</tbody></table>";return{content:n,title:t}},drawRgs:function(c,p,a,m,k){var o=p.routes;if(o&&a){for(var f=0,d=o.length;f<d;f++){var h=o[f];var g=this.getContent(this.travelMode,o,f,p);a.position=new olleh.maps.UTMK(h.point.x,h.point.y);a.title=(m!="")?m:g.title;if(f==0){if(this.markerOptions.zIndex){a.zIndex=k+1}else{a.zIndex=1}if(this.markerOptions.shadow){a.shadow={url:this.imageURL+"mark02.png",size:new olleh.maps.Size(37,32),anchor:new olleh.maps.Point(18.5,32)}}a.icon={url:this.imageURL+"poi01.png",size:new olleh.maps.Size(30,43),anchor:new olleh.maps.Point(15,43)}}else{if(f==(o.length-1)){if(this.markerOptions.zIndex){a.zIndex=k+1}else{a.zIndex=1}if(this.markerOptions.shadow){a.shadow={url:this.imageURL+"mark02.png",size:new olleh.maps.Size(37,32),anchor:new olleh.maps.Point(18.5,32)}}a.icon={url:this.imageURL+"poi02.png",size:new olleh.maps.Size(30,43),anchor:new olleh.maps.Point(15,43)}}else{if(h.type=="1000"){if(this.markerOptions.zIndex){a.zIndex=k+1}else{a.zIndex=1}if(this.markerOptions.shadow){a.shadow={url:this.imageURL+"mark02.png",size:new olleh.maps.Size(37,32),anchor:new olleh.maps.Point(18.5,32)}}a.icon={url:this.imageURL+"poi03.png",size:new olleh.maps.Size(30,43),anchor:new olleh.maps.Point(15,43)}}else{if(this.markerOptions.icon){if(a.zIndex){a.zIndex=k}else{a.zIndex=0}if(this.markerOptions.shadow){a.shadow=this.markerOptions.shadow.clone()}a.icon=this.markerOptions.icon.clone()}else{if(a.zIndex){a.zIndex=k}else{a.zIndex=0}if(this.markerOptions.shadow){var n=new olleh.maps.SpritedImage();n.setStyles({marginLeft:"-12.5px",marginTop:"21px"}).setImage(this.imageURL+"mark02.png",new olleh.maps.Point(0,0),new olleh.maps.Size(25,21));a.shadow={url:this.imageURL+"mark02.png",size:new olleh.maps.Size(25,21),anchor:new olleh.maps.Point(12.5,21)}}var l=(this.travelMode=="DRIVING")?"poi05.png":"poi04.png";a.icon={url:this.imageURL+l,size:new olleh.maps.Size(20,29),anchor:new olleh.maps.Point(10,29)}}}}}var e=new olleh.maps.overlay.Marker(a);c.push(e);var b=new olleh.maps.overlay.InfoWindow({content:g.content,disableAutoPan:false,animation:olleh.maps.overlay.Marker.DROP,padding:"20px"});e.refer={};e.refer.infoWin=b;e.refer.direction=1;e.onEvent(this.event,function(){var i=this.refer.infoWin;if(this.refer.direction>0){i.open(map,this)}else{i.close()}this.refer.direction=-(this.refer.direction)})}}},setOptions:function(a){if(a.map){this.map=a.map}if(a.markerOptions){this.markerOptions=a.markerOptions}if(!this.markerOptions.map){this.markerOptions.map=this.map}if(a.polylineOptions){this.polylineOptions=a.polylineOptions}this.keepView=(a.keepView!=null)?a.keepView:true;this.offMarkers=(a.offMarkers!=null)?a.offMarkers:false;this.offPolylines=(a.offPolylines!=null)?a.offPolylines:false;if(a.directions){this.directions=a.directions}if(this.getMap()){this.removeDirections()}this.setMap(this.map)},getRgTypeStr:function(a){if(a=="0"){return"안내없음"}else{if(a=="1"){return"직진"}else{if(a=="2"){return"1시 방향 우회전"}else{if(a=="3"){return"2시 방향 우회전"}else{if(a=="4"){return"우회전"}else{if(a=="5"){return"4시 방향 우회전"}else{if(a=="6"){return"5시 방향 우회전"}else{if(a=="7"){return"7시 방향 좌회전"}else{if(a=="8"){return"8시 방향 좌회전"}else{if(a=="9"){return"좌회전"}else{if(a=="10"){return"10시 방향 좌회전"}else{if(a=="11"){return"11시 방향 좌회전"}else{if(a=="12"){return"직진 방향에 고가도로 진입"}else{if(a=="13"){return"오른쪽 방향에 고가도로 진입"}else{if(a=="14"){return"왼쪽 방향에 고가도로 진입"}else{if(a=="15"){return"지하차도"}else{if(a=="16"){return"오른쪽 방향에 고가도로 옆 도로"}else{if(a=="17"){return"왼쪽 방향에 고가도로 옆 도로"}else{if(a=="18"){return"오른쪽 방향에 지하차도 옆 도로"}else{if(a=="19"){return"왼쪽 방향에 지하차도 옆 도로"}else{if(a=="20"){return"오른쪽 도로"}else{if(a=="21"){return"왼쪽 도로"}else{if(a=="22"){return"직진 방향에 고속도로 진입"}else{if(a=="23"){return"오른쪽 방향에 고속도로 진입"}else{if(a=="24"){return"왼쪽 방향에 고속도로 진입"}else{if(a=="25"){return"직진 방향에 도시고속도로 진입"}else{if(a=="26"){return"오른쪽 방향에 도시고속도로 진입"}else{if(a=="27"){return"왼쪽 방향에 도시고속도로 진입"}else{if(a=="28"){return"오른쪽 방향에 고속도로 출구"}else{if(a=="29"){return"왼쪽 방향에 고속도로 출구"}else{if(a=="30"){return"오른쪽 방향에 도시고속도로 출구"}else{if(a=="31"){return"왼쪽 방향에 도시고속도로 출구"}else{if(a=="32"){return"분기점에서 직진"}else{if(a=="33"){return"분기점에서 오른쪽"}else{if(a=="34"){return"분기점에서 왼쪽"}else{if(a=="35"){return"U-turn"}else{if(a=="36"){return"무발성 직진"}else{if(a=="37"){return"터널"}else{if(a=="38"){return"없음"}else{if(a=="39"){return"없음"}else{if(a=="40"){return"로터리에서 1시 방향"}else{if(a=="41"){return"로터리에서 2시 방향"}else{if(a=="42"){return"로터리에서 3시 방향"}else{if(a=="43"){return"로터리에서 4시 방향"}else{if(a=="44"){return"로터리에서 5시 방향"}else{if(a=="45"){return"로터리에서 6시 방향"}else{if(a=="46"){return"로터리에서 7시 방향"}else{if(a=="47"){return"로터리에서 8시 방향"}else{if(a=="48"){return"로터리에서 9시 방향"}else{if(a=="49"){return"로터리에서 10시 방향"}else{if(a=="50"){return"로터리에서 11시 방향"}else{if(a=="51"){return"로터리에서 12시 방향"}else{if(a=="999"){return"출발지"}else{if(a=="1000"){return"경유지"}else{if(a=="1001"){return"도착지"}else{return"안내없음"}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}},getMethodtypeStr:function(a){if(a=="1"){return"일반 버스"}else{if(a=="2"){return"좌석 버스"}else{if(a=="3"){return"마을 버스"}else{if(a=="4"){return"직행 좌석 버스"}else{if(a=="5"){return"공항 버스"}else{if(a=="6"){return"간선 급행 버스"}else{if(a=="7"){return"외곽 버스"}else{if(a=="8"){return"간선 버스"}else{if(a=="9"){return"지선 버스"}else{if(a=="10"){return"순환 버스"}else{if(a=="11"){return"광역 버스"}else{if(a=="12"){return"급행 버스"}else{if(a=="13"){return"급행 간선 버스"}else{if(a=="14"){return"지하철"}else{if(a=="15"){return"일반 버스"}else{if(a=="26"){return"좌석 버스"}else{if(a=="2000"){return"마을 버스"}else{if(a=="0"){return"걷기"}else{return"정보없음"}}}}}}}}}}}}}}}}}}}});olleh.maps.DirectionsRenderer.libPath=null;olleh.maps.DirectionsRenderer.getImagesLocation=function(){var d=olleh.maps.DirectionsRenderer.libPath;if(d){return d}var f="";var g=this.scriptName;var e=g.length;var a=document.getElementsByTagName("script");for(var c=0;c<a.length;c++){var h=a[c].getAttribute("src");if(h){var b=h.lastIndexOf(g);if((b>-1)&&(b+e==h.length)){d=h.slice(0,-e);break}}}olleh.maps.DirectionsRenderer.libPath=d;return d};