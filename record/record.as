import flash.media.Microphone;
import flash.net.URLLoader;
import flash.net.URLRequest;
import flash.net.URLLoaderDataFormat;
import flash.net.URLVariables;
import flash.events.Event;
import flash.events.HTTPStatusEvent;
import flash.events.IOErrorEvent;
import flash.events.ProgressEvent;
import flash.events.SecurityErrorEvent;

//mic_test.buttonMode = true;
mic_test.addEventListener(MouseEvent.CLICK,onClick); 
mic_test.addEventListener(MouseEvent.MOUSE_DOWN,onDown); 
mic_test.addEventListener(MouseEvent.MOUSE_UP,onUp);

function onClick(event:MouseEvent):void{
    trace("circle clicked");
	mic_names.text = "onClick()";
	//loadText("test.txt");
	checkMicNames();
	get_Microphone();
}

var loader:URLLoader = new URLLoader();
function loadText(file:String) {
	var request:URLRequest = new URLRequest("test.txt");
	
	loader.addEventListener(Event.COMPLETE, loader_complete);
	loader.load(request);
}

function loader_complete (e:Event):void {
	trace("Event.COMPLETE");
	trace("目标文件的原始数据 (纯文本) : " + loader.data);
	
	// 使用 URLVariables 处理原始数据并进行遍历同时输出数据
	var variables:URLVariables = new URLVariables(loader.data);
	for (var i in variables) {
		trace(i + " : " + variables[i]);
	}
}

function checkMicNames() {
	var deviceArray:Array = Microphone.names;
	
	mic_names.text = "array: " + deviceArray;
	//mic_names.text = "checkMicNames()";
	if (deviceArray == null) {
		mic_names.text = "deviceArray is null";
		return ;
	}
	return ;
	trace("Available sound input devices:");
	mic_names.text = "Available sound input devices:";
	for (var i:int = 0; i < deviceArray.length; i++)
	{
		mic_names.text += "   " + deviceArray[i];
    	trace("   " + deviceArray[i]);
	}
}

function get_Microphone() {
	var mic:Microphone = Microphone.getMicrophone();
	mic.addEventListener(StatusEvent.STATUS, onMicStatus);
	if (mic == null) {
		trace("get mic failed, maybe no mic!");
		mic_status.text = "get mic failed, maybe no mic!";
	} else {
		trace("get mic success!!");
		mic_status.text = "get mic success!!";
		mic.addEventListener(StatusEvent.STATUS, onMicStatus);
	}
}

function onMicStatus(event:StatusEvent):void
{
	mic_names.text = "onMicStatus()";
    if (event.code == "Microphone.Unmuted")
    {
		mic_names.text = "Microphone access was allowed.";
        trace("Microphone access was allowed.");
    } 
    else if (event.code == "Microphone.Muted")
    {
		mic_names.text = "Microphone access was denied.";
         trace("Microphone access was denied.");
    }
}

function onDown(event:MouseEvent):void{ 
    //mic_test.startDrag();
	trace("mouse down");
}
function onUp(event:MouseEvent):void{ 
    //mic_test.stopDrag(); 
	trace("mouse up");
}