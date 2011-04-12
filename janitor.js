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
    var yearAgo       = this._buildHistoricalDate(1); //tk change to 365
    var ninetyDaysAgo = this._buildHistoricalDate(1); //tk change to 365
    
    // Search Queries
    var om_filter     = 'before:' + yearAgo + ' not in:/Trash not from:' + username;
    var ou_filter     = 'is:unread before:' + ninetyDaysAgo + ' not in:/Trash not from:' + username;

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


// Extra Functions  --  tireless helpers who get no thanks at all
//=================================================================+
  zmJanitor.prototype._buildHistoricalDate = function(days) {
    var todayDate           = new Date();
    var todayStart          = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    var history             = new Date(todayStart.getTime() - (days * 24 * 3600 * 1000));
    var history_normalized  = this._normalizeDate(history.getMonth()+1, history.getDate(), history.getFullYear());

    return history_normalized;
  };

  zmJanitor.prototype._normalizeDate = function(month, day, year) {
    var fString = [];
    var ds = I18nMsg.formatDateShort.toLowerCase();
    var arry = [];
    var separator = ds.replace("d", "").replace("y","").replace("m","").substring(0,1);
    arry.push({name:"m", indx:ds.indexOf("m")});
    arry.push({name:"yy", indx:ds.indexOf("yy")});
    arry.push({name:"d", indx:ds.indexOf("d")});
    var sArry = arry.sort(taskReminder_sortTimeObjs);
    for(var i = 0; i < sArry.length; i++) {
      var name = sArry[i].name;
      if(name == "m") {
        fString.push(month);
      } else if(name == "yy") {
        fString.push(year);
      }  else if(name == "d") {
        fString.push(day);
      } 
    }
    return fString.join(separator);
  };

  function taskReminder_sortTimeObjs(a, b) {
    var x = parseInt(a.indx);
    var y = parseInt(b.indx);
    return ((x > y) ? 1 : ((x < y) ? -1 : 0));
  }
