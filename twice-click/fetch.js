$(document).ready(function(){
	//先定义一个工作转换函数
	function covertIntToChar(tucData){
			var con = "";
			if(tucData == 0){
				con="A";
			}else if( tucData == 1){
				con="B";
			}else if(tucData == 2){
				con="C";
			}else if(tucData == 3){
				con="D";
			}
			return con;
	};
	
	
	var flag = $("#flag").attr("title");  //用来标识是否是测试记录的  1是（需要显示用户以前的数据） ，0 不是
	if(flag == 1){ //下面是填充测 "试记录时"的数据   这时的输入框不可在输入数据
		showUserChoiseData();
		showUserJgChoiseData();
		showUserFillBlankData();
		showUserTextAreaData();
		var dbTotalScore = dbTotalScoreObj.getTotalUserScore();
		$("#kgscore").text(dbTotalScore).css("color","red");
		$("#allscore").text(dbTotalScore).css("color","red");
	}else{
		setCheckBoxListener();
		setjgChoiseListenter();
		setDefaultTextAreaData();
		setFillkBlankListener();
	}
	
	$("#submit").click(function(){
		var jsonData = "{";   //最终的json数据
		var fbResult = getFillBlank();
		var jgResult = getjgChoise();
		var checkResult = getCheckbox();
		var zkgText = fetchTextArea();
		
		//这里需要,来连接  否则解析json数据可能会出错
		if(fbResult != ""){
			if(jgResult != "" || checkResult != ""){
				jsonData += fbResult +",";
			}else{      //只有填空题
				jsonData += fbResult ;
			}
		}
		
		if(jgResult != ""){  //有判断题
			if(checkResult != ""){
				jsonData += jgResult +",";
			}else{
				jsonData += jgResult ;
			}
		}
		
		if(checkResult != ""){  //有选择题
			if(zkgText != ""){   //有主观答题
				jsonData += checkResult +","; 
			}else{
				jsonData += checkResult ;
			}
		}
		
		if(zkgText != ""){
			jsonData += zkgText ;
		}
		
		jsonData += "}";
		obj.setJsResult(jsonData);
		
		$(this).hide();
		
		//判断是否有对症下药
		var dzxy = dzxyObj.hasDzxy();
		if(dzxy == 1){
			if($("#flag").attr("title") == 2){//错题本中提交后不再显示对症下药
			}else{
				$("#dzxy").show();
				$("#dzxy").click(function(){
					  //启动对症下药
					startObj.openDzxyKj();
				})
			}
		}
		
		//显示解析和答案
		analysisDisplayControl();
		anwserDisplayControl();
		
		//获取用户最终得分
		var userTotalScore = totalScoreObj.getUserSubmitScore();
		$("#kgscore").text(userTotalScore).css("color","red");
		$("#allscore").text(userTotalScore).css("color","red");  
		
		if($("#userHint") != null){
			$("#userHint").hide();
		}
		
		//跳到页面开头
		$("html,body").animate({ scrollTop: 30 }, 100);
	})
//设置checkbox点击时值得改变       需要一层层的找到选项哦！
function setCheckBoxListener(){
	
	var exechoises = $(".choise");  //所有的选择题
	for(var i = 0 ; i < exechoises.length ; i++){
		var exech = exechoises.eq(i);   //每一题
		var subExes = exech.children(".subExe"); //每一题中的所有的subexercise
		var subExeCount = 0;
		subExeCount = subExes.length;  //每一个题中小题的个数
		if( subExeCount > 0 ){
			for(var m = 0 ; m < subExeCount ; m ++){
				var subExeChoises = subExes.eq(m).children(".ck"); //每个小题中的所有选项
				for(var n = 0 ; n < subExeChoises.length ; n++ ){
					subExeChoises.eq(n).click(function(){  //每个小题中的每一个选项
						if($(this).attr("value") == 0){
							$(this).attr({"value":"1"});
							$(this).find("img").filter(".cimg").attr({"src":"ck_checked.png"});
						}else{
							$(this).attr({"value":"0"});
							$(this).find("img").filter(".cimg").attr({"src":"ck_unchecked.png"});
						}
					});
				}
			}
		}else{
			 var choises = exech.children(".ck"); //每个题中的所有选项
			 for(var j = 0; j < choises.length ; j++){ 
				choises.eq(j).click(function(){  //每个小题中的每一个选项
					if($(this).attr("value") == 0){
						$(this).attr({"value":"1"});
						$(this).find("img").filter(".cimg").attr({"src":"ck_checked.png"});
					}else{
						$(this).attr({"value":"0"});
						$(this).find("img").filter(".cimg").attr({"src":"ck_unchecked.png"});
					}
					});
			}
		}
	}
	
}

//取出所有的选择题
function getCheckbox(){
	var $choiseExe = $(".choise");               //所有选择题Exercise对象的集合
	if($choiseExe.length == 0){  //没有选择题
		return "";
	}
	var checkboxResult ="ckType:1,ckValues:[" ;  //题与题之间以,分隔，
	for(var i = 0 ;i < $choiseExe.length;i++){
		var cExeIndex = $choiseExe.eq(i).attr("id");    //exeIndex
		var subExes = $choiseExe.eq(i).children(".subExe");  //每一个Exercise中SubExercise的个数
		var exeScore = $choiseExe.eq(i).attr("name");  //每个exercise答题的分数
		if(subExes.length > 0){  //有小题的情况
			var subExeAction = "{cseId:" + cExeIndex + ",cseVales:[";
			
			
			//一个exercise下的所有小题
			for(var n = 0; n< subExes.length ; n ++){
				var subExe = subExes.eq(n);      //每一个Exercise中SubExercise对象，每一小题
				var subExeId = subExe.attr("id");     //exeIndex_subExeIndex
				var eveSubExeUserScore = 0;
				var subExeChoises = subExe.children(".ck");//每一个Exercise中SubExercise对象中的choise对象集合
				
				var subRightCount = 0;        //对的个数
			    var subWrongCount = 0;		//错误的个数
			    var subCorrNum = 0;			//记录该小题是单选还是多选
			    
			    var everySubExeAction = "{cseSId:" + subExeId +　",cseSValues :{";　　
			    var subUserAction = "cseUserChoise:";
			    var subCorrectAction = ","+"cseCorrChoise:";
			    
			    var subUserChoise ="";   //用户的选择
			    var subCorrChoise = "";  //正确的答案
				
				//每一小题
				for(var m = 0; m < subExeChoises.length ; m ++){
					var subExeChoise = subExeChoises.eq(m);//每一个Exercise中SubExercise对象中的choise对象
					var subExeChoiseId = subExeChoise.attr("id");  //exeIndex_subExeIndex_choiseIndex
					
					var subExeChoiseValue = subExeChoise.attr("value");
					var subExeChoiseCorrect = subExeChoise.attr("name");
					
					
					if(subExeChoiseCorrect == 1){
						subCorrNum ++;
					}
					
					if(subExeChoiseCorrect == 1 && subExeChoiseValue == subExeChoiseCorrect){ //当前项选择正确
						subRightCount ++;
					}else if(subExeChoiseCorrect == 0 && subExeChoiseValue == 1){   //选错了
						subWrongCount ++;
					}
					
					//记录用户的足迹
					if(subExeChoiseValue == 1){
						subUserAction += m +"_";
						subUserChoise += m +"_";
					}
					//记录课件本来的正确答案
					if(subExeChoiseCorrect == 1){
						subCorrectAction += m + "_";
						subCorrChoise += m + "_";
					}
				}
				
				var subUserChoiseArr = subUserChoise.split("_");
				var subCorrChoiseArr = subCorrChoise.split("_");
				
				var showUserChoise = "";  //显示用户的答案
				for(var suc = 0; suc < subUserChoiseArr.length -1 ; suc ++){
					var sucData = subUserChoiseArr[suc];
					var conver = "";
					if(sucData == 0){
						conver = "A";
					}else if(sucData ==1){
						conver = "B";
					}else if(sucData ==2){
						conver = "C";
					}else if(sucData ==3){
						conver = "D";
					}
					showUserChoise += conver;
				}
				
				var showCorrChoise = "";   //显示正确的答案
				for(var scc = 0 ;scc <subCorrChoiseArr.length -1 ; scc ++ ){
					var corData = subCorrChoiseArr[scc];
					var conver = "";
					if(corData == 0){
						conver = "A";
					}else if(corData ==1){
						conver = "B";
					}else if(corData ==2){
						conver = "C";
					}else if(corData ==3){
						conver = "D";
					}
					showCorrChoise += conver;
				}
				
				
				var showWrongData = "<div style=\"color:red\"> <img src=\"wrong.png\"><br> 用户答案: "+showUserChoise+"<br>"+"正确答案: "+showCorrChoise+"</div>"
				var showRightData = "<div style=\"color:blue\"> <img src=\"right.png\"><br> 用户答案: "+showUserChoise+"<br>"+"正确答案: "+showCorrChoise+"</div>"
				var showHalfRightData = "<div style=\"color:blue\"> <img src=\"halfrw.png\"><br> 用户答案: "+showUserChoise+"<br>"+"正确答案: "+showCorrChoise+"</div>"
				//判断对错
				if(subWrongCount > 0){          //选了不该选的 ，错啦！
					eveSubExeUserScore = 0;
					//找到每一个subExercise下的预留的div 
					subExe.children("#subExeAns").html(showWrongData);
				}else{
					if(subRightCount > 0){
						if(subRightCount == subCorrNum){  //全对
							eveSubExeUserScore = exeScore/subExes.length;
							subExe.children("#subExeAns").html(showRightData);
						}else{							  //半对
							eveSubExeUserScore = exeScore/subExes.length/2;
							subExe.children("#subExeAns").html(showHalfRightData);
						}
					}else{								//用户没有选择，错啦!
						eveSubExeUserScore = 0;
						subExe.children("#subExeAns").html(showWrongData);
					}
				}
				
				if(subUserAction.length == 14){ //该题用户没有选  给一个-1,否则解析json数据会出错
					subUserAction += "-1";
				}
				
				everySubExeAction += subUserAction + subCorrectAction +",userScore:"+eveSubExeUserScore + "}}";
				
				//组装每一题下的所有小题的数据
				if(n == (subExes.length -1)){
					subExeAction += everySubExeAction +"]}";
				}else{
					subExeAction += everySubExeAction + ",";
				}
				
			}
			checkboxResult += subExeAction;
			
		}else{
			var $choise = $choiseExe.eq(i).children(".ck");  //每一个exeercise中的choise对象的集合
			
			
			var rightCount = 0;        //答对题的个数
			var wrongCount = 0;		   //答错的个数
			
			var everyCEResult = "{ ceId:"+cExeIndex ; //每一个 一般判断题的json数据
			var everyCEUserAction = ","+"ceUserChoise:";
			var everyCECorrectAction = ","+"ceCorrChoise:";
			var userScore = 0;
			
			
			var userChoise="" ;    //用户选择的答案
			var corrChoise="" ;   //正确答案
			
			var corrNum = 0;   //记录该小题的正确答案个数，以此来判断是单选还是多选
			//每一题
			for(var j = 0; j < $choise.length ; j++){ 
				var ckid = $choise.eq(j).attr("id"); //exeIndex_cIndex
				
				var ckvalue = $choise.eq(j).attr("value"); //得到每一个checkbox的值，0表示未选 ，1表示选择了
				var ckcorrect = $choise.eq(j).attr("name"); //该choise在解析课件时的值  1表示默认是选中的
				
				if(ckcorrect == 1){  //该题本是对的，加1
					corrNum ++;
				}
				
				
				//判断选择结果的对错
				if(ckcorrect == 1 &&  ckvalue == ckcorrect){//对于当前选项  选择正确了
					rightCount++;
				}else if(ckcorrect == 0 && ckvalue == 1){   //本来是不正确的，但 你却选择了
					wrongCount ++;
				}
				
				//记录用户的足迹
				if(ckvalue == 1){
					everyCEUserAction += j + "_";
					userChoise += j + "_";
				}
				//记录原本的正确答案
				if(ckcorrect == 1){
					everyCECorrectAction += j + "_";
					corrChoise += j + "_";
				}
				
			}//end for loop
			
			var uc = userChoise.split("_");  //分隔后在后面默认会跟一个，不知道为什么
			var cc = corrChoise.split("_");
			
			var convertedUC ="";    //显示用户选择的结果
			for(var tuc = 0; tuc < uc.length -1;tuc ++){
				var tucData = uc[tuc];
				var con = "";
				if(tucData == 0){
					con="A";
				}else if( tucData == 1){
					con="B";
				}else if(tucData == 2){
					con="C";
				}else if(tucData == 3){
					con="D";
				}else if(tucData == -1){
					con="未选";
				}
				convertedUC += con;
				
			}
			
			var convertedCC ="";    //显示正确的结果
			for(var tuc = 0; tuc < cc.length -1;tuc ++){
				var tucData = cc[tuc];
				var con = "";
				if(tucData == 0){
					con="A";
				}else if( tucData == 1){
					con="B";
				}else if(tucData == 2){
					con="C";
				}else if(tucData == 3){
					con="D";
				}
					convertedCC += con;
				
			}
			
			
			var showWrongData = "<div style=\"color:red;font-family:contentFont;\"> <img src=\"wrong.png\"><br> 用户答案: "+convertedUC+"<br>"+"正确答案: "+convertedCC+"</div>"
			var showRightData = "<div style=\"color:blue;font-family:contentFont;\"> <img src=\"right.png\"><br> 用户答案: "+convertedUC+"<br>"+"正确答案: "+convertedCC+"</div>"
			var showHalfRightData = "<div style=\"color:blue;font-family:contentFont;\"> <img src=\"halfrw.png\"><br> 用户答案: "+convertedUC+"<br>"+"正确答案: "+convertedCC+"</div>"
			//判断对错
			if(wrongCount > 0){      //只要一个错选了，该题就错了
				//该题答错了
				userScore = 0;
				$choiseExe.eq(i).children("#showDiv").append(showWrongData);
			}else{
				if(rightCount > 0 ){
					if(rightCount == corrNum){//全对
						//该题正确
						userScore = exeScore;
						$choiseExe.eq(i).children("#showDiv").append(showRightData);
					}else{                    //半对
						//该题是半对
						userScore = exeScore / 2;
						$choiseExe.eq(i).children("#showDiv").append(showHalfRightData);
					}
				}else{
						//该题没有选择		 //未选
					userScore = 0;
					$choiseExe.eq(i).children("#showDiv").append(showWrongData);
				}
			}
			
			//组装json数据
			if(everyCEUserAction.length == 14){ //用户没有选择，给她加上一个-1,表示用户没有选。否则解析json数据会报错
				 everyCEUserAction += "-1";
			}
			everyCEResult += everyCEUserAction + everyCECorrectAction +",userScore:" + userScore + "}";
			
			if(i == ($choiseExe.length - 1)){
				checkboxResult += everyCEResult ;
			}else{
				checkboxResult += everyCEResult + ",";
			}//
	}
 }	
 return checkboxResult + "]";
}
//取出所有的填空题     填空题中的内容输入进行了限制，所以内容中是绝对不可能有,的
function getFillBlank(){
	var $filkblankExe = $(".fillblank");
	if($filkblankExe.length == 0){ //课件没有填空题
		return "";
	}
	var allFBResult = "fbType:2,fbValues:[";    //所有的填空题的用户答案
	for(var i = 0; i < $filkblankExe.length ; i++){
		var $filkblank = $filkblankExe.eq(i).children(".fb");  //每一个大的填空题
		var fbExeIndex = $filkblankExe.eq(i).attr("id");       //exercise的索引
		var exeScore = $filkblankExe.eq(i).attr("name");       //得到每个大题的分数，
		var userScore = 0;                                     //用户做这一大题的得分
		
		
		var everyFBexeResult= "{fbId:"+fbExeIndex;    //每一个填空答题的答案
		
		var wrong = 0;             //对的个数
		var right = 0;			  //错的个数
		
		var userAction ="," + "userFBans:[";    //答案之间的连接使用"  "
		var correctAction ="," + "corrFBans:["; //答案之间的连接使用"  "
		
		var showUserAns = ""; //显示用户的答案
		var showCorrAns = ""; //显示对应的正确的答案
		
		//每一个exercise中的填空的小题集合
		for(var j = 0; j < $filkblank.length; j++){
		  	var fbid = $filkblank.eq(j).attr("id"); //得到每一个filkblank对象的id
			var fbvalue = $filkblank.eq(j).val();   //获取每一个小小题   用户输入的答案 
			
			
			var tempUserData = "";
			fbvalue = fbvalue.replace(/(^\s+)|(\s+$)/g,""); //踢掉左右空格
			//fbvalue = fbvalue.replace(/\s/g,""); //踢掉所有空格         //英语答案有些时候 需要输入多个单词，
			tempUserData = fbvalue;//用户的原生态数据
			
			var fbcorAnswer =  $filkblank.eq(j).attr("name");  //原本正确的答案
			
			if(fbcorAnswer.indexOf("_")> 0 ){ //该空的答案是多个答案
				   var corans = fbcorAnswer.split("_");
				   if(corans.length > 0){
					   //循环遍历正确答案
					   for(var m = 0; m<corans.length ; m++ ){  
					   		if(corans[m] == fbvalue){ //该小填空题答对了
					   			right ++;
					   			break;
					   		}
					   		wrong ++;
					   }
				   }
			}else{                           //该空的答案是唯一的
			   		if(fbvalue == fbcorAnswer){ //只有一个答案 并且用户答对了
			   			right ++;
			   		}else{                  //包含了用户不作答的情况
			   			wrong++;
			   		}
			}   
			
			//保存到数据库中的数据需要特殊的处理
			fbvalue = fbvalue.replace(/[,]/g,'').replace(/[，]/g,'')//替换逗号
			var tempCorrData = fbcorAnswer;
			
			//用户答案和正确答案     需要考虑答案中含有"   否则解析json数据会出错           这里目前没有考虑，
			fbcorAnswer = fbcorAnswer.replace(/[\"]/g,'#');//将\"替换为^
			fbcorAnswer = "\"" + fbcorAnswer + "\""; //答案中是多个单词，单词间有空格
			
			if(fbvalue == ""){   //如果用户没有输入  默认给一个" "值，否则解析json数据时会出错
			    fbvalue = "\" \""; 
			}else{
				fbvalue = fbvalue.replace(/[\"]/g,'#');  //将\"替换为^
				fbvalue = "\"" + fbvalue + "\"";    //用户答案可能是多个单词
			}
			//记录正确的答案，用户答案之间以 , 分隔
			if(j == ($filkblank.length -1) ){
				userAction += fbvalue ;
				correctAction += fbcorAnswer ;
				
				showUserAns += tempUserData;
				showCorrAns += tempCorrData;
			}else{
				userAction += fbvalue +",";
				correctAction += fbcorAnswer +",";
				
				showUserAns += tempUserData +",";
				showCorrAns += tempCorrData +",";
			}
			
		//	$fillblank.eq(j).text(tempUserData);
			//让每一个输入框不可在编辑
			 $filkblank.eq(j).attr("disabled","true");
		}   //每一个exercise下的所有填空 结束 。
		
		
		
		
		
		var showUserRightData  ="<div style=\"color:blue\"><img src=\"right.png\"><br>用户答案: "+ showUserAns+"<br>正确答案: "+showCorrAns+"</div>";
		var showUserWrongData  ="<div style=\"color:red\"><img src=\"wrong.png\"><br>用户答案: "+ showUserAns+"<br>正确答案: "+showCorrAns+"</div>";
		var showUserHalfWrightData  ="<div style=\"color:red\"><img src=\"halfrw.png\"><br>用户答案: "+ showUserAns+"<br>正确答案: "+showCorrAns+"</div>";
		
		//判断对错
		if(right > 0){
			if(right == $filkblank.length){   //全对
				userScore = exeScore;
				$filkblankExe.eq(i).children("#showDiv").append(showUserRightData);
			}else{							  //半对
				userScore = exeScore/$filkblank.length*right;
				$filkblankExe.eq(i).children("#showDiv").append(showUserHalfWrightData);
			}
		}else{								  //全错
			userScore = 0;
			$filkblankExe.eq(i).children("#showDiv").append(showUserWrongData);
		}//
		//组装json数据
		userAction += "]";    //每一个填空答题中所有填空小题的用户答案
		correctAction += "]";  //每一个填空答题中所有填空小题的正确答案
		everyFBexeResult += userAction + correctAction +",userScore:"+userScore +"}";
		
		if(i == ($filkblankExe.length -1)){
			allFBResult += everyFBexeResult +"]";
		}else{
			allFBResult += everyFBexeResult + ",";
		}//
	}
	
	return allFBResult;  //返回所有的答案
}


//为判断题设置点击事件监听
function setjgChoiseListenter(){
	var jgsArray = $(".jgchoise");
	for(var i = 0; i < jgsArray.length;i++){
		var jgs = jgsArray.eq(i).children(".jg");
	   	for(var j = 0; j<jgs.length; j++){
	   		var jg = jgs.eq(j);
	   		//为每一个判断题设置点击事件监听
	   		jg.click(function(){   // 0 对应默认 ，1对应 对  ， 2对应 错
	   			var value = $(this).attr("value");
	   			if(value == 0){ //默认图片
	   				$(this).attr("src","right.png");
	   				$(this).attr("value","1");
	   			}else if(value == 1){
	   				$(this).attr("src","wrong.png");
	   				$(this).attr("value","2");
	   			}else if(value == 2){
	   				$(this).attr("src","defaule.png");
	   				$(this).attr("value","0");
	   			}
	   		});
	   	}
	  }
}
//让填空题获得焦点的实际  滚动，否则会被输入法遮挡
function setFillkBlankListener(){
	var $filkblankExe = $(".fillblank");
	if($filkblankExe.length == 0){ //课件没有填空题
		return "";
	}
	for(var i = 0; i < $filkblankExe.length ; i++){
		var $filkblank = $filkblankExe.eq(i).children(".fb");  //每一个大的填空题
		
		//每一个exercise中的填空的小题集合
		for(var j = 0; j < $filkblank.length; j++){
			var fb = $filkblankExe.eq(j);
			fb.click(function(e){
			var height = e.pageY;
			if(height > 300){
				$("html,body").animate({ scrollTop: height-260 }, 10);
			}
			});
		}
	}	
}

//判断答题
function getjgChoise(){
	var jgsArray = $(".jgchoise");
	if(jgsArray.length == 0){  //没有任何一个判断题
		return "";
	}
	var allJgExeResult ="jgType:3,jgValues:[";   //所有的判断题的json数据
	
	for(var i = 0; i < jgsArray.length;i++){
	   var jgs = jgsArray.eq(i).children(".jg");
	   var jgExeIndex = jgsArray.eq(i).attr("id");
	   
	   
	   var everJgExeResult = "{jgId:" + jgExeIndex ;  //每一个判断题的结果的json数据
	   var userAction =","+"userJgans : [";
	   var corrAction = ","+"corrJgans : [";
	   var exeScore = jgsArray.eq(i).attr("name");
	   var userScore = "";
	   var rightCount = 0;
	   
	   var showUserData = "";     //显示用户的结果
	   var showCorrData = "";	  //显示正确的结果
	   
	   
	   //每一个判断大题下的所有小题
	   for(var j = 0; j<jgs.length; j++){
	   		var jg = jgs.eq(j);
	   		var corState = jg.attr("name");
	   		
	   		var state = jg.attr("name");// 正确答案：1 对，2 错
	   		var userValue = jg.attr("value");  //用户的选择：0：未选，1：对，2:错
	   		
	   		//记录用户以及正确答案的足迹
	   		if(j == (jgs.length -1)){
	   			userAction += "\""+userValue+"\"" ;
	   			corrAction += "\""+state+"\"" ;
	   		}else{
	   			userAction += "\""+userValue+"\"" + ",";
	   			corrAction += "\""+state+"\"" + ",";
	   		}
	   		
	   		//判断对错
	   		if(state == 1){   //本是正确的，
	   			if(state == userValue){  //用户答的是对                           正确
	   				rightCount ++;
	   				if(j == (jgs.length -1)){
	   					showUserData += "对";
	   					showCorrData += "对";
	   				}else{
	   					showUserData += "对" + ",";
	   					showCorrData += "对" + ",";
	   				}
	   			}else if(userValue == 2){  //用户答的是 错                   错误
	   				if(j == (jgs.length -1)){
	   					showUserData += "错";
	   					showCorrData += "对";
	   				}else{
	   					showUserData += "错" + ",";
	   					showCorrData += "对" + ",";
	   				}
	   			}else{                 //用户没有作答                            错误
	   				if(j == (jgs.length -1)){
	   					showUserData += " ";
	   					showCorrData += "对";
	   				}else{
	   					showUserData += " " + ",";
	   					showCorrData += "对" + ",";
	   				}
	   			}
	   		}else{			 //本是错误的 
	   			if(state == userValue){ //用户答的是   错                  state = 2       正确   
	   				rightCount ++;
	   				if(j == (jgs.length -1)){
	   					showUserData += "错";
	   					showCorrData += "错";
	   				}else{
	   					showUserData += "错" + ",";
	   					showCorrData += "错" + ",";
	   				}
	   			}else if(userValue == 1){ //用户答的是     对                   错误
	   				if(j == (jgs.length -1)){
	   					showUserData += "对";
	   					showCorrData += "错";
	   				}else{
	   					showUserData += "对" + ",";
	   					showCorrData += "错" + ",";
	   				}
	   			}else {                  //用户没有作答                       错误
	   				if(j == (jgs.length -1)){
	   					showUserData += " ";
	   					showCorrData += "错";
	   				}else{
	   					showUserData += " " + ",";
	   					showCorrData += "错" + ",";
	   				}
	   			}
	   		}
	   }// end for loop
	   
	   var showRightData = "<div style=\"color:blue\"><img src=\"right.png\"><br>用户答案: " + showUserData + "<br>正确答案: "+showCorrData + "</div>";
	   var showWrongData = "<div style=\"color:red\"><img src=\"wrong.png\"><br>用户答案: " + showUserData + "<br>正确答案: "+showCorrData + "</div>";
	   var showHalfRightData = "<div style=\"color:red\"><img src=\"halfrw.png\"><br>用户答案: " + showUserData + "<br>正确答案: "+showCorrData + "</div>";
	   
	   if(rightCount > 0 ){
	   		if(rightCount == jgs.length){   //全对
	   			userScore = exeScore;
	   			jgsArray.eq(i).children("#showDiv").append(showRightData);
	   		}else{							//半对
		   		userScore = exeScore/jgs.length * rightCount;
		   		jgsArray.eq(i).children("#showDiv").append(showHalfRightData);
	   		}
	   }else{								//全错
	   		userScore = 0;
	   		jgsArray.eq(i).children("#showDiv").append(showWrongData);
	   }
	   
	   //组装json数据
	   userAction += "]";
	   corrAction += "]";
	   everJgExeResult += userAction +corrAction + ",userScore:" + userScore +"}";
	   
	   if(i == (jgsArray.length -1 )){
		   allJgExeResult += everJgExeResult +"]";
	   }else{
		   allJgExeResult += everJgExeResult +",";
	   }//
	   
	}
	return allJgExeResult;
}




//主观答题
function fetchTextArea(){
	var alltextareas = $(".areaDiv"); //主要 这里只能是class，如果用id只能找到一个，不知道为什么
	if(alltextareas.length == 0){
		return "";
	}
	var allTextData = "zgType:6,textValues:[";
	for(var n = 0 ; n <alltextareas.length ; n ++){
		var textareas = alltextareas.eq(n).children("#textarea"); //取出每一题下所有的主观答题的框
		
		var eveExeText = ""; //每一个exercise下的所有的用户输入框
		//目前这里的长度都是为 1
		for(var i = 0; i< textareas.length ; i++){
			var eachTA = textareas.eq(i);
			var exeIndex = eachTA.attr("name");      //主观答题输入框对应的exercise的索引
			var userText = eachTA.val();			//输入框用户输入的答案
			var originalData = "";  //用户输入的原始答案
			
			if(userText == "请在这里输入答案："){//用户没有任何作答
				userText = "null";//这里需要有值  否则解析会出错
				eachTA.text("");
				originalData = "";
			}else{
				originalData = userText;
			}
			userText = userText.replace(/\s/g,"") //去掉所有空格
			if(userText == ""){
				userText = "null";
			}
			
			//传递过去时需要将“替换为#
			userText = "\"" + userText.replace(/[\"]/g,'#') + "\"";
			var everyText = "{exeId:"+exeIndex +",text:"+userText +"}";
			eveExeText += everyText;
			
			//显示用户答案
			var showUserAreaText = "<div style=\"color:red\"> 用户答案：<br>" + originalData +"</div>";
			alltextareas.eq(n).children("#utx").append(showUserAreaText);
			
			
			//让每一个文本域不可在编辑
			eachTA.attr("disabled","true");
			
		}
	
		if(n == (alltextareas.length -1)){
			allTextData += eveExeText + "]";
		}else{
			allTextData += eveExeText + ",";
		}
	}
	return allTextData;
}
//显示解析内容
function analysisDisplayControl(){
	$("div[id*='analysis']").show();
	
}
//显示答案内容
function anwserDisplayControl(){
	$("div[id*='answer']").show();
}


//显示用户以前填写的答案
function showUserChoiseData(){
	var $choiseExe = $(".choise");               //所有选择题Exercise对象的集合
	if($choiseExe.length == 0){  //没有选择题
		return "";
	}
	for(var i = 0 ;i < $choiseExe.length;i++){
		var cExeIndex = $choiseExe.eq(i).attr("id");    //exeIndex
		var subExes = $choiseExe.eq(i).children(".subExe");  //每一个Exercise中SubExercise的个数
		var exeScore = $choiseExe.eq(i).attr("name");  //每个exercise答题的分数
		
		if(subExes.length > 0){  //有小题的情况
			
			var subUserData = dataObj.getUserData(cExeIndex);     //得到用户之前存放的数据,现在的数据一定含有,
			var subUserDataArr = subUserData.split(",");
			
			//一个exercise下的所有小题
			for(var n = 0; n< subExes.length ; n ++){
				var subExe = subExes.eq(n);      //每一个Exercise中SubExercise对象，每一小题
				var subExeId = subExe.attr("id");     //exeIndex_subExeIndex
				
				//判断对错的依据
				var eveSubExeUserScore = scoreObj.getUserScore(cExeIndex);
				var subExeChoises = subExe.children(".ck");//每一个Exercise中SubExercise对象中的choise对象集合
				
			    
			    //得到该小题的用户答案
			   var userData ="";
			   if(subUserData != ""){
			    	userData = subUserDataArr[n];
			   }
			    
			    var subUserChoise ="";   //用户的选择
			    var subCorrChoise = "";  //正确的答案
				
				//每一小题
				for(var m = 0; m < subExeChoises.length ; m ++){
					var subExeChoise = subExeChoises.eq(m);//每一个Exercise中SubExercise对象中的choise对象
					var subExeChoiseId = subExeChoise.attr("id");  //exeIndex_subExeIndex_choiseIndex
					
					var subExeChoiseValue = subExeChoise.attr("value");
					var subExeChoiseCorrect = subExeChoise.attr("name");
					
					//显示用户之前选择的答案
					if(userData != ""){
						if(userData == -1){ //该小题用户没有以前没有任何动作
						}else if(userData.length >= 2){   //用户以前多选了
							for(var tem = 0 ; tem < userData.length; tem++){
								var temData = userData.charAt(tem);
								if(m == temData){
									subExeChoise.find("img").filter(".cimg").attr("src","ck_checked.png");
									subUserChoise += converIntToChar(temData);
								}
							}
						}else {							  //用户以前是单选
							if(m == userData){
								subExeChoise.find("img").filter(".cimg").attr("src","ck_checked.png");
								subUserChoise += converIntToChar(temData);
							}
						}
					}//end show before action
					
					//记录课件本来的正确答案
					if(subExeChoiseCorrect == 1){
						subCorrChoise += m + "_";
					}
				}// end inner for loop
				
				var subCorrChoiseArr = subCorrChoise.split("_");
				
				var showCorrChoise = "";   //显示正确的答案
				for(var scc = 0 ;scc <subCorrChoiseArr.length -1 ; scc ++ ){
					var corData = subCorrChoiseArr[scc];
					showCorrChoise += covertIntToChar(corData);
				}
				var showWrongData = "<div style=\"color:red\"> <img src=\"wrong.png\"><br> 用户答案: "+subUserChoise+"<br>"+"正确答案: "+showCorrChoise+"</div>"
				var showHalfRightData = "<div style=\"color:red\"> <img src=\"halfrw.png\"><br> 用户答案: "+subUserChoise+"<br>"+"正确答案: "+showCorrChoise+"</div>"
				var showRightData = "<div style=\"color:blue\"> <img src=\"right.png\"><br> 用户答案: "+subUserChoise+"<br>"+"正确答案: "+showCorrChoise+"</div>"
				if(eveSubExeUserScore > 0 ){
					if(eveSubExeUserScore == exeScore){
						subExe.children("#subExeAns").html(showRightData);
					}else{
						subExe.children("#subExeAns").html(showHalfRightData);
					}
				}else{
					subExe.children("#subExeAns").html(showWrongData);
				}
			}
		}else{
			var $choise = $choiseExe.eq(i).children(".ck");  //每一个exeercise中的choise对象的集合
			
			//判断对错的依据
			var userScore = scoreObj.getUserScore(cExeIndex);  
			var userData = dataObj.getUserData(cExeIndex);     //得到用户之前存放的数据，
			
			var showUserChoise="" ;    //用户选择的答案
			var showCorrChoise="" ;   //正确答案
			
			var corrNum = 0;   //记录该小题的正确答案个数，以此来判断是单选还是多选
			//每一题
			for(var j = 0; j < $choise.length ; j++){ 
				var ckid = $choise.eq(j).attr("id"); //exeIndex_cIndex
				
				var ckvalue = $choise.eq(j).attr("value"); //得到每一个checkbox的值，0表示未选 ，1表示选择了
				var ckcorrect = $choise.eq(j).attr("name"); //该choise在解析课件时的值  1表示默认是选中的
				
				
				//显示用户以前的动作
				if(userData == -1){      //如果是-1，说明以前用户对该题没有任何操作
				
				}else if(userData.length >= 2){   //以前用户多选的
					for(var tem = 0 ;tem < userData.length; tem ++){
						var temData = userData.charAt(tem);
						if(j == temData){
							$choise.eq(j).find("img").filter(".cimg").attr("src","ck_checked.png");
							showUserChoise += covertIntToChar(temData);
						}
					}
				}else{							//以前用户是单选
					if(j == userData){
						$choise.eq(j).find("img").filter(".cimg").attr("src","ck_checked.png");
						showUserChoise += covertIntToChar(userData);
					}
				}// end show before action 
				
				//记录原本的正确答案
				if(ckcorrect == 1){
					showCorrChoise += j + "_";
				}
				
			}//end for loop
			
			var cc = showCorrChoise.split("_");
			
			var convertedCC ="";    //显示正确的结果
			for(var tuc = 0; tuc < cc.length -1;tuc ++){
				var tucData = cc[tuc];
				convertedCC += covertIntToChar(tucData);
			}
			
			var showWrongData = "<div style=\"color:red\"><img src=\"wrong.png\"><br> 用户答案: "+showUserChoise+"<br>"+"正确答案: "+convertedCC+"</div>"
			var showHalfRightData = "<div style=\"color:red\"> <img src=\"halfrw.png\"><br> 用户答案: "+showUserChoise+"<br>"+"正确答案: "+convertedCC+"</div>"
			var showRightData = "<div style=\"color:blue\"> <img src=\"right.png\"><br> 用户答案: "+showUserChoise+"<br>"+"正确答案: "+convertedCC+"</div>"
			if(userScore > 0){
				if(userScore == exeScore){
					$choiseExe.eq(i).children("#showDiv").append(showRightData);
				}else{
					$choiseExe.eq(i).children("#showDiv").append(showHalfRightData);
				}
			}else{
				$choiseExe.eq(i).children("#showDiv").append(showWrongData);
			}
			
		}//end else
 	}	
 };
 
 //显示以前用户做过的填空题的数据
 function showUserFillBlankData(){
	 var $filkblankExe = $(".fillblank");
	if($filkblankExe.length == 0){ //课件没有填空题
		return "";
	}
	for(var i = 0; i < $filkblankExe.length ; i++){
		var $filkblank = $filkblankExe.eq(i).children(".fb");  //每一个大的填空题
		var fbExeIndex = $filkblankExe.eq(i).attr("id");       //exercise的索引
		
		//用分数来盘对对错
		var exeScore = $filkblankExe.eq(i).attr("name");       //得到每个大题的分数，
		var userScore = scoreObj.getUserScore(fbExeIndex);                                     //用户做这一大题的得分
		
		//在显示内容的同时显示用户以前提交的数据
		var userData = dataObj.getUserData(fbExeIndex);          //大题的数据      数据之间以，分隔
		var userDataArr = userData.split(",");
		//
		var correctAction = "";            //正确答案的显示
		
		//每一个exercise中的填空的小题集合
		for(var j = 0; j < $filkblank.length; j++){
		  	var fbid = $filkblank.eq(j).attr("id"); //得到每一个filkblank对象的id
			
			if(userDataArr.length == $filkblank.length){     //需要填充数据
				$filkblank.eq(j).val(userDataArr[j]);
			}
			
			var fbcorAnswer =  $filkblank.eq(j).attr("name");  //原本正确的答案
			//记录正确的答案，用户答案之间以 , 分隔
			if(j == ($filkblank.length -1) ){
				correctAction += fbcorAnswer ;
			}else{
				correctAction += fbcorAnswer +",";
			}
			
			//让每个输入框不可在编辑
			$filkblank.eq(j).attr("disabled","true");
			
		}   //每一个exercise下的所有填空 结束 。
		
		var showUserRightData  ="<div style=\"color:blue\"><img src=\"right.png\"><br>用户答案: "+ userData+"<br>正确答案: "+correctAction+"</div>";
		var showUserWrongData  ="<div style=\"color:red\"><img src=\"wrong.png\"><br>用户答案: "+ userData+"<br>正确答案: "+correctAction+"</div>";
		var showUserHalfWrightData  ="<div style=\"color:red\"><img src=\"halfrw.png\"><br>用户答案: "+ userData+"<br>正确答案: "+correctAction+"</div>";
		
		if(userScore > 0 ){  
			if(userScore == exeScore){  //全对
				$filkblankExe.eq(i).children("#showDiv").append(showUserRightData);
			}else{                      //半对
				$filkblankExe.eq(i).children("#showDiv").append(showUserHalfWrightData);
			}
		}else{							//全错
			$filkblankExe.eq(i).children("#showDiv").append(showUserWrongData);
		}
		
	}
 };
//显示以前用户的判断题答案
function showUserJgChoiseData(){
	var jgsArray = $(".jgchoise");
	if(jgsArray.length == 0){  //没有任何一个判断题
		return "";
	}
	
	for(var i = 0; i < jgsArray.length;i++){
	   var jgs = jgsArray.eq(i).children(".jg");
	   var jgExeIndex = jgsArray.eq(i).attr("id");
	   
	   //判断对错的依据
	   var exeScore = jgsArray.eq(i).attr("name");
	   var userScore = scoreObj.getUserScore(jgExeIndex);
	   
	   var userData = dataObj.getUserData(jgExeIndex);
	   var userDataArr = userData.split(",");   //结果中可能有0，表示用户没有做任何操作
	   
	   var showCorrData = "";	  //显示正确的结果
	   var showUserData = ""; //显示用户答案
	   
	   //每一个判断大题下的所有小题
	   for(var j = 0; j<jgs.length; j++){
	   		var jg = jgs.eq(j);
	   		var state = jg.attr("name");// 正确答案：1 对，2 错
	   		var userValue = jg.attr("value");  //用户的选择：0：未选，1：对，2:错
	   		
	   		//显示用户答案
	   		var tempUserData = userDataArr[j];
	   		var tempData = "";
	   		if(tempUserData == 1){
	   			tempData = "对";
	   			jg.attr("src","right.png");
	   		}else if(tempUserData == 2){
	   			tempData = "错";
	   			jg.attr("src","wrong.png");
	   		}else{  //0
	   		
	   		}
	   		if(j == (jgs.length - 1)){
	   			showUserData += tempData;
	   		}else{
	   			showUserData += tempData + ",";
	   		}
	   		
	   		
	   		//显示正确答案
	   		var tempCorr = "";
	   		if(state == 1){
	   		    tempCorr = "对";
	   		}else{
	   		 	tempCorr = "错";
	   		}
	   		if(j == (jgs.length -1)){
	   			showCorrData += tempCorr;
	   		}else{
	   			showCorrData += tempCorr + ",";
	   		}
	   }// end for loop
	   
	   var showRightData = "<div style=\"color:blue\"><img src=\"right.png\"><br>用户答案: " + showUserData + "<br>正确答案: "+showCorrData + "</div>";
	   var showWrongData = "<div style=\"color:red\"><img src=\"wrong.png\"><br>用户答案: " + showUserData + "<br>正确答案: "+showCorrData + "</div>";
	   var showHalfRightData = "<div style=\"color:red\"><img src=\"halfrw.png\"><br>用户答案: " + showUserData + "<br>正确答案: "+showCorrData + "</div>";
	   
	   if(userScore > 0 ){
		   if(userScore == exeScore){
	   			jgsArray.eq(i).children("#showDiv").append(showRightData);
		   }else{
			   jgsArray.eq(i).children("#showDiv").append(showHalfRightData);
		   }
	   }else{
		   jgsArray.eq(i).children("#showDiv").append(showWrongData);
	   }
	   
	}
};
//显示解答题输入框中用户以前输入的内容，并让她不可在输入
function showUserTextAreaData(){
	var alltextareas = $(".areaDiv"); //主要 这里只能是class，如果用id只能找到一个，不知道为什么
	for(var n = 0 ; n <alltextareas.length ; n ++){
		var textareas = alltextareas.eq(n).children("#textarea"); //取出每一题下所有的主观答题的框
		
		//目前这里的长度都是为 1
		for(var i = 0; i< textareas.length ; i++){
			var eachTA = textareas.eq(i);
			var exeIndex = eachTA.attr("name");      //主观答题输入框对应的exercise的索引
			var userText = txDataObj.getTextAreaData(exeIndex);
			eachTA.text(userText);
			//显示用户答案
			var showUserAreaText = "<div style=\"color:red\"> 用户答案：<br>" + userText +"</div>";
			alltextareas.eq(n).children("#utx").append(showUserAreaText);
			//让每一个文本域不可在编辑
			eachTA.attr("disabled","true");
			
		}
	}
}
//为用户答题输入框设置默认内容
function setDefaultTextAreaData(){
	var alltextareas = $(".areaDiv"); //主要 这里只能是class，如果用id只能找到一个，不知道为什么
	for(var n = 0 ; n <alltextareas.length ; n ++){
		var textareas = alltextareas.eq(n).children("#textarea"); //取出每一题下所有的主观答题的框
		
		//目前这里的长度都是为 1
		for(var i = 0; i< textareas.length ; i++){
			var eachTA = textareas.eq(i);
			eachTA.text("请在这里输入答案：");
			eachTA.focus(function(){
				$(this).text("");
			});
			eachTA.blur(function(){
				var text = $(this).val();
				if(text == ""){
					$(this).text("请在这里输入答案：");
				}
			})
			
			eachTA.click(function(e){
			var height = e.pageY;
			 	if( height > 300){
			 		$("html,body").animate({ scrollTop: height-260 }, 10);
			 	}
			})
			
		}
	}
}

//获取隐藏域的数据                      显示界面的总分情况
var hideData = $("#data").val();
var kjData = hideData.split(",");
for(var i = 0;i < kjData.length;i++){
	if(i == 0){
		$("#kgtotal").text(kjData[i]);  //设置客观题分数
	}else if(i == 1){
		$("#zgtotal").text(kjData[i]);  //设置主观题分数
	}else if(i == (kjData.length -1)){
		$("#alltotal").text(kjData[i]);         //设置总计分数
	}
}
})