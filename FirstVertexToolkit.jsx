//©July 2016  Cody Sorgenfrey
//
//Randomizes first vertex of selected masks.
// 
//version history
//1.0 Initial release. Jul 2016

var proj = app.project;
var undoStr = "First Vertex Toolkit";
var fvt_scriptName = "First Vertex Toolkit";
var fvt_version = "1.0";
var numLayers = 0;


function fvtBuildUI(thisObj){
    if (thisObj instanceof Panel) {
        var myPal = thisObj;
    } else {
        var myPal = new Window("palette",fvt_scriptName + " v" + fvt_version,undefined, {resizeable:true});
    }

    if (myPal != null) {
        var res =
        "group { \
                alignment: ['fill', 'fill'], \
                alignChildren: ['left','top'], \
                orientation: 'column', \
            optionsGrp: Panel { \
                alignment: ['fill','top'], \
                alignChildren: ['left','top'], \
                text:'Options', \
                modeGrp: Group { \
                    orientation: 'row', \
                    alignment: ['fill','top'], \
                    modeTxt: StaticText {text: 'Mode', alignment:['left','center']}, \
                    modeDrpDwn: DropDownList {alignment:['left','center']}, \
                },\
                pointGrp: Group { \
                    orientation: 'row', \
                    alignment: ['fill','top'], \
                    pointTxt: StaticText {text: 'Point Layer', alignment:['left','center']}, \
                    pointDrpDwn: DropDownList {alignment:['left','center']}, \
                },\
            }\
            toolsGrp: Panel { \
                alignment: ['fill','top'], \
                alignChildren: ['left','top'], \
                text:'Tools', \
                maskToolsGrp: Group { \
                    orientation: 'row', \
                    alignment: ['fill','top'], \
                    selectMaskBtn: Button {text: 'Select all masks on current layer(s)', alignment:['left','center']}, \
                },\
                shapeToolsGrp: Group { \
                    orientation: 'row', \
                    alignment: ['fill','top'], \
                    selectShapeBtn: Button {text: 'Select all shapes on current layer(s)', alignment:['left','center']}, \
                },\
                openCloseGrp: Group { \
                    orientation: 'row', \
                    alignment: ['fill','top'], \
                    openCloseBtn: Button {text: 'Toggle selected masks/shapes closed', alignment:['left','center']}, \
                }\
            }, \
            btnGrp: Group { \
                orientation: 'row', \
                alignment: ['fill','top'], \
                helpBtn: Button {text: '?', alignment:['left','top']},\
                editBtn: Button {text:'Do it!', alignment:['right','top']}, \
            } \
        }";
        
        myPal.grp = myPal.add(res);
        
        // Populate Drop Down
        var modeOptions = ["Ranomize First Vertex","Reverse Direction", "Closest to Point"];
        for (var i=0; i<modeOptions.length; i++) {
            myPal.grp.optionsGrp.modeGrp.modeDrpDwn.add("item",modeOptions[i]);
        }
        myPal.grp.optionsGrp.modeGrp.modeDrpDwn.selection = 0;
        
        if (!app.project.activeItem){
        	alert("Must have a comp open.");
        } 
        var pointOptions = app.project.activeItem.layers;
        numLayers = pointOptions.length;
        for (var i=1; i<=pointOptions.length; i++) {
            myPal.grp.optionsGrp.pointGrp.pointDrpDwn.add("item", (pointOptions[i].index + ". " + pointOptions[i].name));
        }
        myPal.grp.optionsGrp.pointGrp.pointDrpDwn.selection = 0;
        myPal.grp.optionsGrp.pointGrp.pointDrpDwn.enabled = false;
        
        // Add fuctions to buttons
        myPal.grp.btnGrp.editBtn.onClick = editVertices;
        myPal.grp.btnGrp.helpBtn.onClick = helpFunc;
        myPal.grp.toolsGrp.maskToolsGrp.selectMaskBtn.onClick = selectAllMasks;
        myPal.grp.toolsGrp.shapeToolsGrp.selectShapeBtn.onClick = selectAllShapes;
        myPal.grp.toolsGrp.openCloseGrp.openCloseBtn.onClick = openClose;
        
        myPal.grp.optionsGrp.modeGrp.modeDrpDwn.onChange = function(){
            if (myPal.grp.optionsGrp.modeGrp.modeDrpDwn.selection.valueOf() == 2){
                myPal.grp.optionsGrp.pointGrp.pointDrpDwn.enabled = true;
            } else {
                myPal.grp.optionsGrp.pointGrp.pointDrpDwn.enabled = false;
            }
        }
        myPal.grp.optionsGrp.pointGrp.pointDrpDwn.onActivate = function(){
            var pointOptions = app.project.activeItem.layers;
            if (numLayers != pointOptions.length){
                numLayers = pointOptions.length;
                myPal.grp.optionsGrp.pointGrp.pointDrpDwn.removeAll();
                for (var i=1; i<=pointOptions.length; i++) {
                    myPal.grp.optionsGrp.pointGrp.pointDrpDwn.add("item", (pointOptions[i].index + ". " + pointOptions[i].name));
                }
            }
        }

        // -- Final Cleanup
        myPal.layout.layout(true);
        myPal.layout.resize();
        myPal.onResizing = myPal.onResize = function () {this.layout.resize();}
    }
    return myPal;
}
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomizeFirstPoint(myMaskShape){
	var verts = myMaskShape.vertices;
    var newVerts = [];
    var ins = myMaskShape.inTangents;
    var newIns = [];
    var outs = myMaskShape.outTangents;
    var newOuts = [];
    var newStart = getRandomIntInclusive(1, (verts.length - 1));

    for (z=0;z<verts.length;z++){
        var index = ((newStart + z) % verts.length);

        newVerts[z] = verts[index];
        newIns[z] = ins[index];
        newOuts[z] = outs[index];
        
        myMaskShape.vertices = newVerts;
        myMaskShape.inTangents = newIns;
        myMaskShape.outTangents = newOuts;
    }
    
    return myMaskShape;
}
function reverseOrder(myMaskShape){
	var verts = myMaskShape.vertices;
    var newVerts = [];
    var ins = myMaskShape.inTangents;
    var newIns = [];
    var outs = myMaskShape.outTangents;
    var newOuts = [];
    
    for (z=0;z<verts.length;z++){
        var index = ((verts.length - 1) - z);
        index = (index + 1) % verts.length;

        newVerts[z] = verts[index];
        newIns[z] = outs[index];
        newOuts[z] = ins[index];
        
        myMaskShape.vertices = newVerts;
        myMaskShape.inTangents = newIns;
        myMaskShape.outTangents = newOuts;
    }
    
    return myMaskShape;
}
function closestToPoint(myMaskShape, shapeProp){
	var layerIndex = fvtPanel.grp.optionsGrp.pointGrp.pointDrpDwn.selection.index;
	var point = app.project.activeItem.layers[layerIndex+1].transform.position.value;
	
	var verts = myMaskShape.vertices;
    var newVerts = [];
    if (shapeProp){
	    var compareVerts = convertCoords(shapeProp);
    } else {
	    var compareVerts = verts;
    }
    var ins = myMaskShape.inTangents;
    var newIns = [];
    var outs = myMaskShape.outTangents;
    var newOuts = [];
    var newStart = 0;
    var distances = []
    
    for (z=0;z<verts.length;z++){
	    distances[z] = [];
	    distances[z][0] = distVectors(compareVerts[z], point);
	    distances[z][1] = z;
    }
	
	distances.sort(sortDistances);
	newStart = distances[0][1];
	
	for (z=0;z<verts.length;z++){
        var index = ((newStart + z) % verts.length);

        newVerts[z] = verts[index];
        newIns[z] = ins[index];
        newOuts[z] = outs[index];
    
        myMaskShape.vertices = newVerts;
        myMaskShape.inTangents = newIns;
        myMaskShape.outTangents = newOuts;
    }
    
    return myMaskShape;
}
function editVertices(){
	if (proj){
		var myComp = app.project.activeItem;
		
		if (myComp != null && (myComp instanceof CompItem)){
			app.beginUndoGroup(undoStr);
			var selectedProps = app.project.activeItem.selectedProperties;
			
			if (selectedProps.length != 0){
				
				for (x=0;x<selectedProps.length;x++){
					if (selectedProps[x].maskShape){
	                       if (fvtPanel.grp.optionsGrp.modeGrp.modeDrpDwn.selection.valueOf() == 0){
	                           selectedProps[x].maskShape.setValue(randomizeFirstPoint(selectedProps[x].maskShape.value));
	                       } else if (fvtPanel.grp.optionsGrp.modeGrp.modeDrpDwn.selection.valueOf() == 1){
	                           selectedProps[x].maskShape.setValue(reverseOrder(selectedProps[x].maskShape.value));
	                       } else {
		                       selectedProps[x].maskShape.setValue(closestToPoint(selectedProps[x].maskShape.value, null));
	                       }
					} else if (selectedProps[x].path){
	                    if (fvtPanel.grp.optionsGrp.modeGrp.modeDrpDwn.selection.valueOf() == 0){
	                           selectedProps[x].path.setValue(randomizeFirstPoint(selectedProps[x].path.value));
	                    } else if (fvtPanel.grp.optionsGrp.modeGrp.modeDrpDwn.selection.valueOf() == 1){
	                           selectedProps[x].path.setValue(reverseOrder(selectedProps[x].path.value));
	                    } else {
	                           selectedProps[x].path.setValue(closestToPoint(selectedProps[x].path.value, selectedProps[x].path));
	                    }
	                 } 
				}
				app.endUndoGroup();
			} else {
			alert("Please select at least one mask or shape to use this script.");
			}
		} else {
		alert("Please select an active comp to use this script");
		}
	} else {
		alert("Please open a project first to use this script.");
	}
}
function selectAllMasks(){
    var selectedLayers = app.project.activeItem.selectedLayers;
    
	for (x=0;x<selectedLayers.length;x++){
	    var Masks = selectedLayers[x].property("ADBE Mask Parade");
	    for (y=1;y<=Masks.numProperties;y++){
		    Masks.property(y).selected = true;
	    }
    }   
}
function selectAllShapes(){
    var selectedLayers = app.project.activeItem.selectedLayers;
    
	for (x=0;x<selectedLayers.length;x++){
	    var shapeContents = selectedLayers[x].property("ADBE Root Vectors Group");
        selectShapes(shapeContents);
    }   
}
function openClose(){
	var selectedProps = app.project.activeItem.selectedProperties;
			
	if (selectedProps.length != 0){
		
		for (x=0;x<selectedProps.length;x++){
			if (selectedProps[x].maskShape){
				var myShape = selectedProps[x].maskShape.value;
                if (myShape.closed == false){
	                myShape.closed = true;
                } else {
	                myShape.closed = false;
                }
                selectedProps[x].maskShape.setValue(myShape);
			} else if (selectedProps[x].path){
				var myPath = selectedProps[x].path.value;
                if (myPath.closed == false){
                    myPath.closed = true;
                } else {
                    myPath.closed = false;
                }
                selectedProps[x].path.setValue(myPath);
            } 
		}
	}
}
function distVectors(obj1, obj2){
	return Math.sqrt(Math.pow((obj2[0]-obj1[0]), 2)) + (Math.pow((obj2[1]-obj1[1]), 2));
}
function sortDistances(a,b){
	return a[0]-b[0];
}
function selectShapes(propParent){
	if (propParent !== null){
		var prop;
		
		for (var i=1; i<=propParent.numProperties; i++)
		{
			prop = propParent.property(i);
			switch (prop.propertyType)
			{
				case PropertyType.INDEXED_GROUP:
					selectShapes(prop);
					break;
				case PropertyType.NAMED_GROUP:
					if (prop.matchName === "ADBE Vector Group"){
					    try{
						    prop.selected = true;
						}
						catch (e){alert(e);}
					}
					selectShapes(prop);
					break;
				default:
					break;
			}
		}
	}
}
function helpFunc(){
	var btnPnlResource =
	"Panel { \
		alignment: ['fill', 'fill'], \
		alignChildren: ['left','top'], \
		orientation:'column', \
		text: 'Help', \
		helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'First Vertex Toolkit Mode: Select the operation you want to do to your selected masks/shapes.', alignment:['left','center'], properties:{multiline:true} }\
        },\
        helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'Randomize First Vertex mode: Change the first vertex of the selected masks/shapes to a random vertex in the mask/shape. (This mode will change the order, and therefor the shape of a mask/path that is not closed).', alignment:['left','center'], properties:{multiline:true} }\
        },\
        helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'Reverse Order mode: Changes the direction that a mask/shape goes.', alignment:['left','center'], properties:{multiline:true} }\
        },\
        helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'Closest to point mode: Sets the first vertex of the mask/shape to the point closest to the given object. WARNING: this mode does not take transformations in shape layers into account.', alignment:['left','center'], properties:{multiline:true} }\
        },\
        helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'Point layer: The layer for controlling the Closest to point mode.', alignment:['left','center'], properties:{multiline:true} }\
        },\
        helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'Select all masks on current layers: Selects all the masks on the current layer. Due to api limitations the layer will not unfold to the selected masks, but they are selected.', alignment:['left','center'], properties:{multiline:true} }\
        },\
        helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'Select all shapes on current layers: Selects all the shapes on the current layer. Due to api limitations the layer will not unfold to the selected shapes, but they are selected.', alignment:['left','center'], properties:{multiline:true} }\
        },\
        helpGrp: Group { \
            orientation: 'row', \
            alignment: ['fill','top'], \
            helpText: StaticText { text:'Toggle selected masks/shapes closed: Closes the selected mask/shape or opens it.', alignment:['left','center'], properties:{multiline:true} }\
        }\
	}";
	dlg = new Window("palette",fvt_scriptName + " v" + fvt_version,undefined, {resizeable:true});
	dlg.add(btnPnlResource);
	dlg.show();
}
function convertCoords(myShape){
	var myLayer = myShape.propertyGroup(myShape.propertyDepth);
	var layerPos = myLayer.property("Transform").property("Position").value;
	var layerAch = myLayer.property("Transform").property("Anchor Point").value;
	var myOffset = [(layerPos[0] - layerAch[0]), (layerPos[1] - layerAch[1])];
	
	var shapeVerts = myShape.value.vertices;
	var newShapeVerts = [];
	
	for (thisVertIndex=0;thisVertIndex<shapeVerts.length;thisVertIndex++){
		newShapeVerts.push([(myOffset[0] + shapeVerts[thisVertIndex][0]), (myOffset[1] + shapeVerts[thisVertIndex][1])]);
	}
	return newShapeVerts;
}

// -- Main
var fvtPanel = fvtBuildUI(this);
if (parseFloat(app.version) < 8) {
    alert("This script requires Adobe After Effects CS3 or later.");
} else {
    if (fvtPanel != null && fvtPanel instanceof Window) { fvtPanel.show(); }
}
 // End