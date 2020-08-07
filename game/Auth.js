class Auth {
  static auth2 = null;

  static isSignedIn = false;

  static loginCallback = null;

  static signIn(callback) {
    var self = this;
    this.auth2.signIn().then((e) => {
      self.isSignedIn = true;
      callback();
    }).catch((e) => {
      callback();
    });
  }

  static load(callback) {
    this.loginCallback = callback;

    var self = this;

    gapi.load('auth2', function() {

      self.auth2 = gapi.auth2.init({
          client_id: '959981766504-9m4sm16bkc2572ki2umr4r86rmvpecdu.apps.googleusercontent.com',
          scope: 'profile'
      }).then((auth2)=> {

        self.auth2 = auth2;

        auth2.isSignedIn.listen((isSignedIn) => {
          self.isSignedIn = isSignedIn;
          if(self.loginCallback) {
            self.loginCallback();
          }
          self.loginCallback = null;
        });

        // Listen for changes to current user.
        auth2.currentUser.listen((a) => {
          //GoogleApi.isSignedIn =
          //callback();
          console.log(a)
        });

        self.isSignedIn = auth2.isSignedIn.get();;
        self.loginCallback();
        self.loginCallback = null;


      });


    });
  }
}
