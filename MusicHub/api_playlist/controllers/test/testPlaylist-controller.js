var assert = require('assert');
var sinon = require ('sinon');
var chai = require('chai');
var common = require('musichub-common');
var PlaylistController = require('../playlist-controller');
var Playlist = common.Playlist;
var Music = common.Music;



describe('Playlist-controller', function() {
	
	var req;
	var res;
    var controller;
    var email = "admin@admin.com";
    var pass = "123456";
    var musicId = "abcd";
    var musicPlatform = "deezer";
    var playlistName = "name";
	var stub = [];
	
	beforeEach(function() {
	    // runs before each test in this block
		controller = new PlaylistController();
		res = {
			status:function(val){return this;},
			json:function(val){return this;}
		};
		req = {
			params: {
				playlistName:playlistName
			},
			body:{
				musicId:musicId,
				musicPlatform:musicPlatform,
				playlistName:playlistName
			},
			session:{
				destroy:function(){},
				email:email
			}
		};
	});
	
	afterEach(function() {
	    // runs after each test in this block
		for(var i=0;i<stub.length;i++) {
			stub[i].restore();
		}
		stub = [];
	});
	
	
	describe('method createPlaylist', function() {
        it('should create the user', function(done) {
        	stub.push(sinon.stub(Playlist.prototype,"save"));
        	stub.push(sinon.spy(res,"status"));
        	stub.push(sinon.stub(res,"json"));
        	stub[0].callsArgWith(0,null);
        	stub[2].callsFake(function() {
        		try {
        			chai.expect(stub[0].called).to.deep.equal(true);
        			chai.expect(stub[1].called).to.deep.equal(true);
        			chai.expect(stub[1].getCall(0).args[0]).to.deep.equal(200);
        			chai.expect(stub[2].getCall(0).args[0]).to.deep.equal({message:"OK"});
            		done();
        		}catch(err) {
        			done(err);
        		}
        	});
        	controller.createPlaylist(req,res);
        });
	});
});