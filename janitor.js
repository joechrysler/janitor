//=================================================================+
// Alert users if they have old email that will be purged
//   by  Joe Chrysler
//   for Dennis Hughes
//   @   Saginaw Valley State University
//   in  April 2011
//=================================================================+

// Global Counters  --  what was he thinking?
//=================================================================+
    window.om_count         = 0;
    window.ou_count         = 0;


// Initialize the Zimlet Framework  --  helpful
//=================================================================+
  zmJanitor = function() {
    ZmZimletBase.call(this);
  };
  zmJanitor.prototype               = new ZmZimletBase;
  zmJanitor.prototype.constructor   = zmJanitor;
  zmJanitor.prototype.init          = function() { this.findOldMessages(); };


// Send AJAX request  --  like a high tech carrier pigeon
//  om = old messages
//  ou = old unreads
//=================================================================+
  zmJanitor.prototype.findOldMessages = function() {
    var _types        = new AjxVector();
    var username      = appCtxt.get(ZmSetting.USERNAME);
    _types.add("MSG");

    // Pertinent dates
    var om_oldness    = '365day';
    var ou_oldness    = '90day';
    
    // Search Queries
    var om_filter     = 'date:<=-' + om_oldness + ' not in:/Trash not from:' + username;
    var ou_filter     = 'is:unread date:<=-' + ou_oldness + ' not in:/Trash not from:' + username;

    // Ajax callbacks
    var om_callback   = new AjxCallback(this, this._om_handler);
    var ou_callback   = new AjxCallback(this, this._ou_handler);


    // Search for old messages
    appCtxt.getSearchController().search({
      query:      om_filter,
      userText:   false,
      limit:      9999,
      types:      _types,
      noRender:   true,
      callback:   om_callback
    });

    // Search for old unreads
    appCtxt.getSearchController().search({
      query:      ou_filter,
      userText:   false,
      limit:      9999,
      types:      _types,
      noRender:   true,
      callback:   ou_callback
    });

    // Both queries take a little bit of time, so we have to wait a bit before
    // showing the warning message
    setTimeout(function(thisObj) {thisObj._displayWarning();}, 5000, this);
  };


// Warn the User  --  softly, but wielding a large stick
  zmJanitor.prototype._displayWarning = function() {
    if (window.om_count > 1000)
      window.om_count = 'a whole lot of';
    if (window.ou_count > 1000)
      window.ou_count = 'a whole lot of';


    var warningMessage = "You have " + window.om_count + " emails that are almost a year old<br />"
                       + "and " + window.ou_count + " unread emails that are almost 3 months old.<br />"
                       + "To conserve space, ITS will be automatically deleting these messages<br />"
                       + "within the next couple of weeks.<br /><br />Save any important messages to your "
                       + "own PC some time this week.";

    var warningAnimation = [ZmToast.FADE_IN,
                            ZmToast.PAUSE,
                            ZmToast.PAUSE,
                            ZmToast.PAUSE,
                            ZmToast.PAUSE,
                            ZmToast.PAUSE,
                            ZmToast.PAUSE,
                            ZmToast.PAUSE,
                            ZmToast.PAUSE,
                            ZmToast.FADE_OUT];

    if (window.ou_count > 0 && window.om_count > 0)
      appCtxt.getAppController().setStatusMsg(warningMessage, ZmStatusView.LEVEL_CRITICAL, null, warningAnimation);
  };


// Handle Ajax Responses
//=================================================================+
  zmJanitor.prototype._om_handler = function(response) {
    var messages = response.getResponse().getResults("MSG").getArray();
    window.om_count = messages.length;
  };
  zmJanitor.prototype._ou_handler = function(response) {
    var messages = response.getResponse().getResults("MSG").getArray();
    window.ou_count = messages.length;
  };
