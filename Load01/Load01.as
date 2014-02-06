package {
	import flash.display.GradientType;
	import flash.display.Loader;
	import flash.display.LoaderInfo;
	import flash.display.MovieClip;
	import flash.display.SimpleButton;
	import flash.display.Sprite;
	import flash.net.URLRequest;
	import flash.events.Event;
	import flash.events.IOErrorEvent;
	import flash.events.MouseEvent;
	import flash.text.TextField;
	import flash.text.TextFormat;
	public class Load01 extends Sprite {
		private var tiptf:TextField;
		private var swfstage:Sprite;
		private var swfstageW:Number=350;
		private var swfstageH:Number=280;
		private var loader:Loader;
		public function Load01() {
			var spritebtn:Sprite=new Sprite();
			var btn1=LoadButton("加载影片一");
			var btn2=LoadButton("加载影片二");
			btn2.y=20;
			var btn3=LoadButton("加载影片三");
			btn3.y=40;
			var btn4=LoadButton("加载影片四");
			btn4.y=60;
			spritebtn.addChild(btn1);
			spritebtn.addChild(btn2);
			spritebtn.addChild(btn3);
			spritebtn.addChild(btn4);
			addChild(spritebtn);
			var bg:Sprite=new Sprite();
			bg.graphics.lineStyle(4,0xffffff,0.80);
			bg.graphics.drawRect(0,0,swfstageW+4,swfstageH+4);
			swfstage=new Sprite();
			swfstage.graphics.beginFill(0x000000,0.85);
			swfstage.graphics.drawRect(0,0,swfstageW,swfstageH);
			swfstage.graphics.endFill();
			var swfmask:Sprite=new Sprite();
			swfmask.graphics.beginFill(0xffffff);
			swfmask.graphics.drawRect(0,0,swfstageW,swfstageH);
			swfmask.graphics.endFill();
			swfstage.x=(stage.stageWidth-swfstage.width-spritebtn.width)/2;
			swfstage.y=(stage.stageHeight-swfstage.height)/2;
			tiptf=new TextField();
			tiptf.multiline=true;
			tiptf.wordWrap=true;
			tiptf.width=swfstage.width-20;
			var textformat:TextFormat=new TextFormat();
			textformat.color=0xff0000;
			tiptf.defaultTextFormat=textformat;
			swfstage.addChild(tiptf);
			swfmask.x=swfstage.x;
			swfmask.y=swfstage.y;
			swfstage.mask=swfmask;
			bg.x=swfstage.x-2;
			bg.y=swfstage.y-2;
			addChild(bg);
			addChild(swfstage);
			addChild(swfmask);
			spritebtn.y=(stage.stageHeight-spritebtn.height)/2;
			spritebtn.x=swfstage.x+swfstage.width;
			btn1.name="A";
			btn2.name="B";
			btn3.name="C";
			btn4.name="D";
			btn1.addEventListener(MouseEvent.CLICK,loadswf);
			btn2.addEventListener(MouseEvent.CLICK,loadswf);
			btn3.addEventListener(MouseEvent.CLICK,loadswf);
			btn4.addEventListener(MouseEvent.CLICK,loadswf);
			loader=new Loader();
			loader.alpha=1;
			swfstage.addChild(loader);
		}
		private function loadswf(e:MouseEvent):void {
			var url:String="";
			switch (e.target.name) {
				case "A" :
					url="_takeme.swf";
					break;
				case "B" :
					url="_trot.swf";
					break;
				case "C" :
					url="_weather.swf";
					break;
				case "D" :
					url="_wewish.swf";
					break;
			}
			var urlrequest:URLRequest=new URLRequest(url);
			loader.unloadAndStop();//卸载并停止
			loader.load(urlrequest);
			loader.contentLoaderInfo.addEventListener(Event.COMPLETE,playnew);
			loader.contentLoaderInfo.addEventListener(IOErrorEvent.IO_ERROR,onioerror);
		}
		private function playnew(e:Event):void {
			var loaderinfo:LoaderInfo=LoaderInfo(e.target);
			var swfsw:Number=loaderinfo.width;//被加载文件的舞台宽度
			var swfsh:Number=loaderinfo.height;//被加载文件的舞台高度
			var swfw:Number=loaderinfo.content.width;//被加载文件的宽度
			var swfh:Number=loaderinfo.content.height;//被加载文件的高度
			var scaleW:Number=swfstageW/swfsw;
			var scaleH:Number=swfstageH/swfsh;
			var scale:Number;
			if (scaleW>scaleH) {
				scale=scaleW;
			} else {
				scale=scaleH;
			}
			loader.width=swfw*scale;
			loader.height=swfh*scale;
		}
		private function onioerror(e:IOErrorEvent):void{
			tiptf.text=e.text;
			tiptf.autoSize="left";
			tiptf.x=10;
			tiptf.y=(swfstage.height-tiptf.height)/2;
		}
		private function LoadButton(btnText:String):SimpleButton {
			var sup:Sprite=new Sprite();
			sup.graphics.lineStyle(1,0xffffff,0.75);
			sup.graphics.beginGradientFill(GradientType.LINEAR,[0x0000FF,0x00FF00],[0.75,0.75],[100,255]);
			sup.graphics.drawRect(0,0,65,18);
			sup.graphics.endFill();
			var sover:Sprite=new Sprite();
			sover.graphics.lineStyle(1,0xffffff,0.75);
			sover.graphics.beginGradientFill(GradientType.LINEAR,[0xFF00FF,0xFFFF00],[0.75,0.75],[100,255]);
			sover.graphics.drawRect(0,0,65,18);
			sover.graphics.endFill();
			var btntf1:TextField=new TextField();
			btntf1.text=btnText;
			btntf1.multiline=false;
			btntf1.autoSize="left";
			sup.addChild(btntf1);
			var btntf2:TextField=new TextField();
			btntf2.text=btnText;
			btntf2.multiline=false;
			btntf2.autoSize="left";
			sover.addChild(btntf2);
			var btn:SimpleButton=new SimpleButton(sup,sover,sup,sup);
			return btn;
		}
	}
}