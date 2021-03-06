/**
 * 鐢ㄦ埛缁�
 * */
var basic_group = {
		
	grid: function(dom){		
        if (typeof(dom) == "undefined")dom = document.body;
		var toolbar = basic_group.grid_toolbar();
		var config = {
			columns: [
			     { display: il8n.basic_normal.code, name: 'code' ,align: 'left', width: 80  }
			    ,{ display: il8n.basic_normal.name, name: 'name', width: 150 ,align: 'left' }			    
			    ,{ display: il8n.basic_normal.type, name: 'type_', isSort: false , width: 80}
			    ,{ display: il8n.basic_normal.status, name: 'status_', isSort: false , width: 80}				    
			    ,{ display: il8n.basic_group.count_users, name: 'count_users', width:100 }
			]
			,pageSize:20 ,rownumbers:true
			,height: '100%'
			,parms: {
                 executor: mainWindow().basic_user.loginData.username
                ,session: mainWindow().basic_user.loginData.session
                
                ,search: "{}"
			}
			,url: config_path__basic_group__grid
			,method: "POST"
			,id : "basic_group__grid"
			,toolbar: { items: toolbar}
		};		
		
        if(dom == "config"){
            return config;
        }
        $(dom).ligerGrid(config);
	}
	
	,grid_getSelectOne: function(){
		var selected;
		if($.ligerui.get('basic_group__grid').options.checkbox){
			selected = $.ligerui.get('basic_group__grid').getSelecteds();
			if(selected.length!=1){ 
				alert(getIl8n("selectOne") );
				return;
			}
			selected = selected[0];
		}else{
			selected = $.ligerui.get('basic_group__grid').getSelected();
			if(selected==null){
				alert(getIl8n("selectOne"));
				return;
			}
		}	
		return selected;
	}	
	
	,search: function(){

		var formD;
		if($.ligerui.get("formD")){
			formD = $.ligerui.get("formD");
			formD.show();
		}else{
			$(document.body).append("<form id='form'></form>");
			$("#form").ligerForm({
				inputWidth: 170
				,labelWidth: 90
				,space: 40
				,fields: [
					 { display: top.getIl8n('name'), name: "name",  type: "text" }
					,{ display: top.getIl8n('type'), name: "type",  type: "select", options :{data: basic_parameter_data.basic_group__type, valueField : "code" , textField: "value" } }
					,{ display: top.getIl8n('code'), name: "code",  type: "text" }
				]
			}); 
			$.ligerDialog.open({
				 id: "formD"
				,width: 350
				,height: 200
				,content: form
				,title: top.getIl8n('search')
				,buttons : [
					{text: top.getIl8n('clear'), onclick:function(){
						$.ligerui.get("basic_group__grid").options.parms.search = "{}";
						$.ligerui.get("basic_group__grid").setOptions({newPage:1});
						$.ligerui.get("basic_group__grid").loadData();
						
						var doms = $("[ligeruiid]",$('#form'));
						for(var i=0;i<doms.length;i++){
						    var theid = $(doms[i]).attr('ligeruiid');
						    $.ligerui.get(theid).setValue('');
						}
					}},
				    {text: top.getIl8n('search'), onclick:function(){
				    	var data = {};
						var doms = $("[ligeruiid]",$('#form'));
						for(var i=0;i<doms.length;i++){
						    var theid = $(doms[i]).attr('ligeruiid');
						    var thetype = $(doms[i]).attr('ltype');                                                        
						 
					        var thevalue = $.ligerui.get(theid).getValue();
					        if(thetype=='date')thevalue = $('#'+theid).val();
						    if(thevalue!="" && thevalue!=0 && thevalue!="0" && thevalue!=null){
						        eval("data."+theid+"='"+thevalue+"'");
						    }
						}
						
						$.ligerui.get("basic_group__grid").options.parms.search= $.ligerui.toJSON(data);
						$.ligerui.get("basic_group__grid").setOptions({newPage:1});
						$.ligerui.get("basic_group__grid").loadData();
				}}]
			});
		}
	}	

	,add: function(){
		$(document.body).append("<form id='form'></form>");
		var config = {
			id: 'basic_group__insert',
			fields: [
				 { display: il8n.basic_normal.name, name: "name", type: "text",  validate: { required:true} }
				,{ display: top.getIl8n('type'), name: "type", type: "select", options: { data: basic_parameter_data.basic_group__type, valueField: "code", textField: "value", slide: false }, validate: { required: true } }
				,{ display: top.getIl8n('code'), name: "code", type: "text", validate: {required:true } }
			]
		};
		var form = $('#form').ligerForm(config);		
		$('#form').append('<br/><br/><div id="buttons"><input type="submit" value="'+top.getIl8n('submit')+'" id="basic_group__submit" class="l-button l-button-submit" /></div>' );
		
		var v = $('#form').validate({
			debug: true,
            errorPlacement: function (lable, element) {         	
                element.parent().addClass("l-text-invalid");
                $(element).removeAttr("title").ligerHideTip();
                $(element).attr("title", lable.html()).ligerTip();
            },
            success: function (lable,element) {            	
                $(element).parent().removeClass("l-text-invalid");
            },
			submitHandler: function () {
				if(basic_group.ajaxState)return;
				basic_group.ajaxState = true;
				$("#basic_group__submit").attr("value",il8n.basic_normal.waitting);
				
				var data = {};
				var doms = $("[ligeruiid]",$('#form'));
				for(var i=0;i<doms.length;i++){
				    var theid = $(doms[i]).attr('ligeruiid');
				    var thetype = $(doms[i]).attr('ltype');                                                        
				 
			        var thevalue = $.ligerui.get(theid).getValue();
			        if(thetype=='date')thevalue = $('#'+theid).val();
				    if(thevalue!="" && thevalue!=0 && thevalue!="0" && thevalue!=null){				    	
				        data[theid]=thevalue;
				    }
				}
				
				$.ajax({
					url: config_path__basic_group__add,
					data: {
						 executor: top.basic_user.loginData.username
						,session:top.basic_user.loginData.session					
						
						,data: $.ligerui.toJSON(data)
					},
					type: "POST",
					dataType: 'json',						
					success: function(response) {		
						$("#basic_group__submit").attr("value",top.getIl8n('submit'));			
						basic_group.ajaxState = false;
						if(response.status=='1'){						
							alert(top.getIl8n('done'));
						}else if(response.status=="2"){							
							alert(response.msg);
						}
					},
					error : function(){
						alert(top.getIl8n('disConnect'));
					}
				});	
			}
		});			
	}
	
	,ajaxState: false 	
	,modify: function(){
		config_path__basic_group__add = config_path__basic_group__modify;
		basic_group.add();	
		$('[ligeruiid=code]').attr("disabled","disabled").css("background-color","#EEEEEE").parent().css("background-color","#EEEEEE");
		$.ajax({
			url: config_path__basic_group__view,
			data: {
                 executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session
                
				,code: getParameter("code", window.location.toString() )
			},
			type: "POST",
			dataType: 'json',						
			success: function(response) {		
				var data = response.data;

				var doms = $("[ligeruiid]",$('#form'));
				for(var i=0;i<doms.length;i++){
				    var theid = $(doms[i]).attr('ligeruiid');
				    var thetype = $(doms[i]).attr('ltype');
			        $.ligerui.get(theid).setValue(data[theid]);
				}
			},
			error : function(){
				alert(il8n.basic_normal.disConnect);
			}
		});	
	}		
	
	,remove: function(){
		selected = $.ligerui.get('basic_group__grid').getSelecteds();
		if(selected.length==0){alert(top.getIl8n("noSelect"));return;}
		var codes = "";
		for(var i=0; i<selected.length; i++){
			codes += selected[i].code+",";
		}
		codes = codes.substring(0,codes.length-1);		
		if(confirm(top.getIl8n("sureToDelete"))){			
			$.ajax({
				url: config_path__basic_group__remove
				,data: {
					codes: codes 
					
					,executor: top.basic_user.loginData.username
					,session: top.basic_user.loginData.session
				}
				,type: "POST"
				,dataType: 'json'
				,success: function(response) {
					if(response.status=='1'){						
						$.ligerui.get('basic_group__grid').loadData();
					}
				}
				,error : function(){
					alert(top.getIl8n('disConnect'));
				}
			});				
		}	
	}
	
	,permission_get: function(){
		$(document.body).append('<ul id="tree"></ul>');
		$('#tree').ligerTree({
			 id: 'basic_group__permission_get'
			,autoCheckboxEven : false
			,data: [
	                { name: "" , code: '1' },
	                { name: "" , code: '2' },
	                { name: "" , code: '3' },
	                { name: "" , code: '4' }
	            ]
			,textFieldName : 'name'
			,slide : true
			,nodeWidth : 140	
		});
		
		$.ligerui.get('basic_group__permission_get').clear();

		$.ajax({
		    url: config_path__basic_group__permission_get,
		    data: {
		        code: getParameter("code", window.location.toString())
				, executor: top.basic_user.loginData.username
				, session: top.basic_user.loginData.session
		    },
		    type: "POST",
		    dataType: 'json',
		    success: function (response) {
		        $.ligerui.get('basic_group__permission_get').setData(response.permissions);
		    },
		    error: function () {
		        alert(top.getIl8n('disConnect'));
		    }
		});

		
		$(document.body).append('<input type="button" onclick="basic_group.permission_set()" value="'+top.getIl8n('modify')+'" id="button" class="l-button l-button-submit" style="position:absolute;top:5px;left:200px;"  />' );
	}
	
	,permission_set: function(){
		if(basic_group.ajaxState)return;							
		
		var arr = $.ligerui.get('basic_group__permission_get').getChecked();
		var codes = ""
		    ,cost_ = ""
		    ,credits_ = "";
		if(arr.length != 0){
			for(var i=0;i<arr.length;i++){
				codes += arr[i].data.code+",";
				cost_ += arr[i].data.cost+",";
				credits_ += arr[i].data.credits+",";
			}
			codes = codes.substring(0,codes.length-1);
			cost_ = cost_.substring(0,cost_.length-1);
			credits_ = credits_.substring(0,credits_.length-1);
		
			//淇敼AJAX鐨勯�淇＄姸鎬�
			$('#button').attr("value",top.getIl8n('waitting'));
			basic_group.ajaxState = true;
		}else{
			alert(top.getIl8n('selectOne'));
			return;
		}
		
		$.ajax({
			url: config_path__basic_group__permission_set,
			data: {
				 codes: codes 
				,cost_: cost_ 
				,credits_: credits_ 
				,code: getParameter("code", window.location.toString() )
			
				,executor: top.basic_user.loginData.username
				,session: top.basic_user.loginData.session
			},
			type: "POST",
			dataType: 'json',
			success: function(response) {
				$('#button').remove();
				basic_group.ajaxState = false;
				if(response.status!="1"){					
					alert(response.msg);
				}else{
					alert(top.getIl8n('done'));
				}
			},
			error : function(){
				alert(top.getIl8n('disConnect'));
			}
		});
	}	
	
	,treegrid: function(dom){

        if (typeof(dom) == "undefined")dom = document.body;
        var config = {
            columns: [   
                 { display: '鍚嶇О', name: 'name', id:'name',width: 250 ,align: 'left' }
                ,{ display: '缂栫爜', name: 'code_', id:'code_',width: 150 ,align: 'left' }
                ,{ display: '绫诲瀷', name: 'type',width: 80 ,align: 'left' }
            ]
        	,id: "basic_group__grid"
        	,width: '100%'
        	,height: '100%'
        	,tree: { columnId: 'name' }
        	,usePager: false
        	,onGroupExtend: function(rowdata){
        		var code = rowdata.code;
        		var children = rowdata.children;
        		if(children.length==0){
        	        $.ajax({
        	             url: config_path__basic_group__treegrid
        	            ,data: {                    
        	                 upcode: rowdata.code_
        	                
        	                ,executor: top.basic_user.loginData.username
        	                ,session: top.basic_user.loginData.session
        	            }
        	            ,type: "POST"
        	            ,dataType: 'json'       
        	            ,success: function(response) {
        	            	var target = $.ligerui.get("basic_group__grid").getRow(rowdata.__index);
        	            	for(var i=0;i<response.Rows.length;i++){
        	            		$.ligerui.get("basic_group__grid").add(response.Rows[i],null,true,target);
        	            	}
        	            }           
        	            ,error : function(){               
        	                alert("net error");
        	            }
        	        });
        		}
        	}
            ,parms : {
                executor: top.basic_user.loginData.username
                ,session: top.basic_user.loginData.session     
                ,upcode: "0"
            }        	
        	,url: config_path__basic_group__treegrid
        	,toolbar: { items: []}
        	,method: "POST"         
        };

                
        $(dom).ligerGrid(config);

    }
	
	,grid_toolbar: function(){
		var items = [];
		var permissions_ = mainWindow().basic_user.loginData.permissions;
        var permissions__ = ["120101","120102","120121","120122","120123","120140"];     
        if(getParameter("group_get"))var permissions__ = ["120101"];     
        
        for(var i=0;i<permissions__.length;i++){ 
        	if((","+permissions_+",").indexOf(","+permissions__[i]+",")<=0)continue;
            var theFunction = function(){};
            var thecode = permissions__[i];
            var actioncode = thecode.substring(thecode.length-2,thecode.length);
			
			if(actioncode=='01'){
				theFunction = basic_group.search;
			}
			if(actioncode=='02'){
				theFunction = function(){					

				};
			}			
			else if(actioncode =='23'){
                theFunction = basic_group.remove;
            }			
			else if(actioncode=='21'){
				theFunction = function(){
					var template = getParameter("template");

					var win = mainWindow().$.ligerDialog.open({ 
				         url: "basic_group__add.html?template="+template+"&f=b#"
				        ,height: 500
				        ,width: 500
				        ,title: il8n.basic_normal.add
						,isHidden: false                
						,showMax: true
						,showToggle: true
						,showMin: true
						,isResize: true
				        ,id: "basic_group__add"
						,modal: false                
				    });  
					win.doMax();
				};
			}
			else if(actioncode=='22'){
				theFunction = function(){
	            	if(mainWindow().$.ligerui.get("basic_group__modify")){
	            		return;
	            	}else{
						var selected = basic_group.grid_getSelectOne();
	            		var code = selected.code;
	            	}					
					
	            	mainWindow().$.ligerDialog.open({ 
						 url: 'basic_group__modify.html?code='+code+"&for=bar"
						,height: 230
						,width: 350
						,isHidden: false
						,showMax: true
						,showToggle: true
						,showMin: true	
						,id: "basic_group__modify"
						,title: selected.name+" "+il8n.basic_normal.modify
						,modal: false
					});				
				};			
			}	
			else if(actioncode=='40'){
				theFunction = function(){
					var selected = basic_group.grid_getSelectOne();
					if(!selected)return;
					if(mainWindow().$.ligerui.get("basic_group__permission_get__"+selected.code))return;
					
					mainWindow().$.ligerDialog.open({ 
						url: 'basic_group__permission_get.html?code='+selected.code+'&random='+Math.random()
						,height: 500
						,width: 400
						,title: il8n.basic_normal.modify
						,id: "basic_group__permission_get__"+selected.code
						,isHidden: false
					});						
				};
			}	
				
			items.push({line: true });
            items.push({
                text: T.icon[actioncode] , img:"../file/icon16x16/"+actioncode+".png" , click: theFunction , id: thecode
            });  
		}		
        
        return items;
	}
};

