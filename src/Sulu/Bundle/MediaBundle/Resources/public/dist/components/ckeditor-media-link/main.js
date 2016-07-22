define(["underscore","config","services/sulumedia/user-settings-manager","text!./skeleton.html"],function(a,b,c,d){"use strict";var e=[{name:"id",translation:"public.id",disabled:!0,"default":!1,sortable:!0},{name:"thumbnails",translation:"media.media.thumbnails",disabled:!1,"default":!0,sortable:!0,type:"thumbnails"},{name:"title",translation:"public.title",disabled:!1,"default":!1,sortable:!0,type:"title"},{name:"size",translation:"media.media.size",disabled:!1,"default":!0,sortable:!0,type:"bytes"}];return{defaults:{options:{link:{},singleSelect:!0,saveCallback:function(a){}},templates:{skeleton:d,uploadUrl:"/admin/api/media?collection=<%= id %>&locale=<%= locale %>"},translations:{mediaLink:"sulu-media.ckeditor.media-link",remove:"sulu-media.ckeditor.media-link.dialog.remove",uploadInfo:"media-selection.list-toolbar.upload-info",noData:"navigation.media.collections.empty",title:"navigation.media.collections",selectedTitle:"sulu-media.ckeditor.media-link.dialog.selected",search:"navigation.media.collections.search",allMedias:"media-selection.overlay.all-medias"}},initialize:function(){this.initializeDialog(),this.bindCustomEvents()},bindCustomEvents:function(){this.sandbox.on("husky.data-navigation.media-link.selected",this.dataNavigationSelectHandler.bind(this)),this.sandbox.on("husky.dropzone.media-link.files-added",function(a){return this.sandbox.emit("sulu.labels.success.show","labels.success.media-upload-desc","labels.success"),this.options.singleSelect?(this.setId(a[0].id),this.save(a[0]),this.sandbox.emit("husky.overlay.media-link.close")):void this.addFilesToDatagrid.call(this,a)}.bind(this)),this.sandbox.on("sulu.toolbar.media-link.add",function(){this.sandbox.emit("husky.dropzone.media-link.open-data-source")}.bind(this)),this.sandbox.on("husky.overlay.dropzone-media-link.opened",function(){this.$el.find(".single-media-selection").addClass("dropzone-overlay-opened")}.bind(this)),this.sandbox.on("husky.overlay.dropzone-media-link.closed",function(){this.$el.find(".single-media-selection").removeClass("dropzone-overlay-opened")}.bind(this))},save:function(a){return this.validate()?void this.options.saveCallback(this.getData(a)):!1},validate:function(){return!!this.id},getData:function(b){return a.extend(this.options.link,{id:this.id,title:this.options.link.title?this.options.link.title:b.title})},setId:function(a){this.id=parseInt(a,10)},dataNavigationSelectHandler:function(a){var b,c=this.sandbox.translate("media-selection.overlay.all-medias");a?(b=a.id,c=a.title,$(".list-toolbar-container").show(),this.sandbox.emit("husky.toolbar.media-link.item.show","add"),this.sandbox.emit("husky.dropzone.media-link.enable"),this.hideSelected()):($(".list-toolbar-container").hide(),this.sandbox.emit("husky.toolbar.media-link.item.hide","add"),this.sandbox.emit("husky.dropzone.media-link.disable"),this.showSelected()),this.sandbox.emit("husky.datagrid.media-link.url.update",{collection:b,page:1}),this.changeUploadCollection(b),this.$el.find(".list-title").text(c)},hideSelected:function(){this.$el.find(".selected-container").hide()},showSelected:function(){this.$el.find(".selected-container").show()},changeUploadCollection:function(a){this.sandbox.emit("husky.dropzone.media-link.change-url",this.templates.uploadUrl({id:a,locale:this.options.locale}))},addFilesToDatagrid:function(a){for(var b=-1,c=a.length;++b<c;)a[b].selected=!0;this.sandbox.emit("husky.datagrid.media-link.records.add",a),this.sandbox.emit("husky.data-navigation.media-link.collections.reload")},initializeDialog:function(){var a=this.sandbox.dom.createElement('<div class="overlay-container"/>');this.sandbox.dom.append(this.$el,a);var b=[{type:"cancel",align:"left"}];this.options.link.id&&b.push({text:this.translations.remove,align:"center",classes:"just-text",callback:function(){this.options.removeCallback(),this.sandbox.emit("husky.overlay.media-link.close")}.bind(this)}),this.sandbox.start([{name:"overlay@husky",options:{openOnStart:!0,removeOnClose:!0,el:a,container:this.$el,skin:"wide",cssClass:"single-media-selection",instanceName:"media-link",slides:[{title:this.translations.mediaLink,data:this.templates.skeleton({title:this.translations.allMedias,selectedTitle:this.translations.selectedTitle}),buttons:b}]}}]).then(function(){this.setId(this.options.link.id),this.initializeFormComponents()}.bind(this))},initializeFormComponents:function(){this.sandbox.start([{name:"data-navigation@husky",options:{el:this.$el.find(".navigation-container"),resultKey:"collections",showAddButton:!1,instanceName:"media-link",rootUrl:"/admin/api/collections?sortBy=title",url:"/admin/api/collections?sortBy=title",nameKey:"title",globalEvents:!1,translates:{noData:this.translations.noData,title:this.translations.title,addButton:"",search:this.translations.search}}},{name:"dropzone@husky",options:{el:this.$el.find(".dropzone-container"),maxFilesize:b.get("sulu-media").maxFilesize,url:"/admin/api/media?locale="+this.options.locale,method:"POST",paramName:"fileVersion",instanceName:"media-link",dropzoneEnabled:!1,cancelUploadOnOverlayClick:!0,maxFiles:this.options.singleSelect?1:null}}]),this.id&&(this.sandbox.start([{name:"datagrid@husky",options:{el:this.$el.find(".selected-datagrid-container"),url:["/admin/api/media?locale=",this.options.locale,"&fields=id,thumbnails,title,size","&orderBy=media.created&orderSort=DESC&ids=",this.id].join(""),matchings:e,view:"datagrid/decorators/masonry-view",resultKey:"media",instanceName:"media-selected",viewSpacingBottom:180,selectedCounter:!1,pagination:!1,viewOptions:{"datagrid/decorators/masonry-view":{selectable:!1,locale:this.options.locale}}}}]),this.sandbox.once("husky.datagrid.media-selected.loaded",function(a){return 0===a.total?this.$el.find(".selected-container").remove():void this.showSelected()}.bind(this))),this.sandbox.sulu.initListToolbarAndList.call(this,"mediaOverlay",e,{el:this.$el.find(".list-toolbar-container"),showTitleAsTooltip:!1,instanceName:"media-link",hasSearch:!1,template:this.sandbox.sulu.buttons.get({add:{options:{id:"add",title:this.translations.uploadInfo,hidden:!0,callback:function(){this.sandbox.emit("husky.dropzone.media-link.open-data-source")}.bind(this)}}})},{el:this.$el.find(".list-datagrid-container"),url:["/admin/api/media?locale=",this.options.locale,"&orderBy=media.created&orderSort=DESC"].join(""),view:"datagrid/decorators/masonry-view",pagination:"infinite-scroll",resultKey:"media",instanceName:"media-link",viewSpacingBottom:180,selectedCounter:!1,actionCallback:function(a,b){this.setId(a),this.save(b)}.bind(this),viewOptions:{"datagrid/decorators/masonry-view":{selectable:!1,locale:this.options.locale}},paginationOptions:{"infinite-scroll":{reachedBottomMessage:"public.reached-list-end",scrollContainer:".list-container",scrollOffset:500}}})}}});
