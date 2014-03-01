/*******************************************************************************
 * Copyright 2014 The MITRE Corporation 
 *   and the MIT Kerberos and Internet Trust Consortium
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/

var AccessTokenModel = Backbone.Model.extend({
	idAttribute: 'id',

	defaults:{
		id:null,
		value:null,
		idTokenId:null,
		refreshTokenId:null,
		scopes:[],
		clientId:null,
		userId:null,
		expiration:null
	},
	
	urlRoot: 'api/tokens/access'
});

var AccessTokenCollection = Backbone.Collection.extend({
	idAttribute: 'id',
	
	model: AccessTokenModel,
	
	url: 'api/tokens/access'
	
});

var AccessTokenView = Backbone.View.extend({
	
	tagName: 'tr',
	
    initialize:function () {

        if (!this.template) {
            this.template = _.template($('#tmpl-access-token').html());
        }

        if (!this.scopeTemplate) {
        	this.scopeTemplate = _.template($('#tmpl-scope-list').html());
        }

        this.model.bind('change', this.render, this);
        
    },
    
    events: {
		'click .btn-delete':'deleteToken',
		'click .token-substring':'showTokenValue'
	},
	
    render:function (eventName) {
    	
		var expirationDate = this.model.get("expiration");

		if (expirationDate == null) {
			expirationDate = "Never";
		} else if (!moment(expirationDate).isValid()) {
			expirationDate = "Unknown";
		} else {
			expirationDate = moment(expirationDate).calendar();
		}
    	
		var json = {token: this.model.toJSON(), client: this.options.client.toJSON(), formattedExpiration: expirationDate};

		this.$el.html(this.template(json));

		// hide full value
    	$('.token-full', this.el).hide();
		
		// show scopes
        $('.scope-list', this.el).html(this.scopeTemplate({scopes: this.model.get('scopes'), systemScopes: app.systemScopeList}));	
		
        return this;
    },
    
    deleteToken:function () {

        if (confirm("Are you sure sure you would like to revoke this token?")) {
        	
            var self = this;

            this.model.destroy({
                success:function () {
                	
                    self.$el.fadeTo("fast", 0.00, function () { //fade
                        $(this).slideUp("fast", function () { //slide up
                            $(this).remove(); //then remove from the DOM
                            app.tokensListView.togglePlaceholder();
                        });
                    });
                },
            	error:function (error, response) {
            		
					//Pull out the response text.
					var responseJson = JSON.parse(response.responseText);
            		
            		//Display an alert with an error message
            		$('#modalAlert div.modal-body').html(responseJson.errorMessage);
            		
        			 $("#modalAlert").modal({ // wire up the actual modal functionality and show the dialog
        				 "backdrop" : "static",
        				 "keyboard" : true,
        				 "show" : true // ensure the modal is shown immediately
        			 });
            	}
            });

            app.tokensListView.delegateEvents();
        }

        return false;
    },
    
    close:function () {
        $(this.el).unbind();
        $(this.el).empty();
    },
    
    showTokenValue:function () {
    	$('.token-substring', this.el).hide();
    	$('.token-full', this.el).show();
    }
});

var RefreshTokenModel = Backbone.Model.extend({
	idAttribute: 'id',

	defaults:{
		id:null,
		value:null,
		scopes:[],
		clientId:null,
		userId:null,
		expiration:null
	},
	
	urlRoot: 'api/tokens/refresh'
});

var RefreshTokenCollection = Backbone.Collection.extend({
	idAttribute: 'id',
	
	model: RefreshTokenModel,
	
	url: 'api/tokens/refresh'
	
});

var RefreshTokenView = Backbone.View.extend({
	
	tagName: 'tr',
	
    initialize:function () {

        if (!this.template) {
            this.template = _.template($('#tmpl-refresh-token').html());
        }

        this.model.bind('change', this.render, this);
        
    },
    
    events: {
		'click .btn-delete':'deleteToken'
	},
	
    render:function (eventName) {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },
    
    deleteToken:function () {

        if (confirm("Are you sure sure you would like to revoke this token?")) {
        	
            var self = this;

            this.model.destroy({
                success:function () {
                	
                    self.$el.fadeTo("fast", 0.00, function () { //fade
                        $(this).slideUp("fast", function () { //slide up
                            $(this).remove(); //then remove from the DOM
                            app.tokenListView.togglePlaceholder();
                        });
                    });
                },
            	error:function (error, response) {
            		
					//Pull out the response text.
					var responseJson = JSON.parse(response.responseText);
            		
            		//Display an alert with an error message
            		$('#modalAlert div.modal-body').html(responseJson.errorMessage);
            		
        			 $("#modalAlert").modal({ // wire up the actual modal functionality and show the dialog
        				 "backdrop" : "static",
        				 "keyboard" : true,
        				 "show" : true // ensure the modal is shown immediately
        			 });
            	}
            });

            app.tokenListView.delegateEvents();
        }

        return false;
    },
    
    close:function () {
        $(this.el).unbind();
        $(this.el).empty();
    }
});

var TokenListView = Backbone.View.extend({
	tagName: 'span',
	
	events:{
		"click .refresh-table":"refreshTable"
	},

	refreshTable:function() {
		var _self = this;
		_self.model.access.fetch({
			success: function() {
				_self.model.refresh.fetch({
					success:function() {
						_self.render();
					}
				})
			}
		});
	},
	
	togglePlaceholder:function() {
		if (this.model.access.length > 0) {
			$('#access-token-table', this.el).show();
			$('#access-token-table-empty', this.el).hide();
		} else {
			$('#access-token-table', this.el).hide();
			$('#access-token-table-empty', this.el).show();
		}
		if (this.model.refresh.length > 0) {
			$('#refresh-token-table', this.el).show();
			$('#refresh-token-table-empty', this.el).hide();
		} else {
			$('#refresh-token-table', this.el).hide();
			$('#refresh-token-table-empty', this.el).show();
		}
	},
	
	render: function (eventName) {
		
		// append and render the table structure
		$(this.el).html($('#tmpl-token-table').html());
	
		var _self = this;
		
		_.each(this.model.access.models, function (token) {
			// look up client
			var client = app.clientList.getByClientId(token.get('clientId'));
			
			$('#access-token-table', _self.el).append(new AccessTokenView({model: token, client: client}).render().el);

		});
		
		// refresh token goes here
		
/*
		_.each(this.model.models, function (scope) {
			$("#scope-table", this.el).append(new SystemScopeView({model: scope}).render().el);
		}, this);
*/
		
		this.togglePlaceholder();
		
		return this;
	}
});
