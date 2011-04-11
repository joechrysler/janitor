
//=================================================================+
// Alert users if they have old email that will be purged
//   by  Joe Chrysler
//   for Dennis Hughes
//   @   Saginaw Valley State University
//   in  March 2011
//=================================================================+

// Initialize the Zimlet Framework  --  helpful
//=================================================================+
/*function zmJanitor() {} */
  zmJanitor = function() {
    ZmZimletBase.call(this);
  };
  zmJanitor.prototype               = new ZmZimletBase;
  zmJanitor.prototype.constructor   = zmJanitor;
  zmJanitor.prototype.init          = function() { this.displayDialog(); };


// Send AJAX request
//   zimbra stores usernames with @domain, ldap stores them without
//   the @... inconsistencies abound. ye be warned.
//=================================================================+
  zmJanitor.prototype.displayDialog = function() {
    var username        = appCtxt.get(ZmSetting.USERNAME).split("@")[0];
    var callbck         = new AjxCallback(this, this._rpcCallback);
    var _types          = new AjxVector();
    var yearAgo         = this._buildHistoricalDate(1); //tk change to 365 //tk change to 365
    var ninetyDaysAgo   = this._buildHistoricalDate(90);
    _types.add("MSG");

    appCtxt.getSearchController().search({
      query:      'before:' + yearAgo + ' not from:' + username,
      userText:   true,
      limit:      9999,
      types:      _types,
      noRender:   false,
      callback:   callbck
  });
}

  zmJanitor.prototype._buildHistoricalDate = function(days) {
    var todayDate           = new Date();
    var todayStart          = new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());
    var history             = new Date(todayStart.getTime() - (days * 24 * 3600 * 1000));
    var history_normalized  = this._normalizeDate(history.getMonth()+1, history.getDate(), history.getFullYear());

    return history_normalized;
  };

  zmJanitor.prototype._normalizeDate =
  function(month, day, year) {
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

// Check the AJAX result
//   the first line of output is old emails, second is old unreads
//=================================================================+
zmJanitor.prototype._rpcCallback = function(response) {
  var messages = response.getResponse().getResults("MSG").getArray();
  if (messages.length == 0) {
    alert ("There's nothing here!");
    return;
  }
  var messageObjects = new Array();
  var tmp = new Date();
  var showReminder = false;
  var today = new Date(tmp.getFullYear(), tmp.getMonth(), tmp.getDate());
  for (var i=0; i < messages.length; i++) {
    alert("Hello\n" + messages[i]);
  }
  /*var answer      = response.text.split("\n");*/
  /*var oldEmails   = answer[0];*/
  /*var oldUnreads  = answer[1];*/
  /*var message     = "You have " + oldEmails + " emails that are almost a year old.<br />"*/
  /*+ "and " + oldUnreads + " unread emails that are almost 3 months old.<br />"*/
  /*+ "To conserve space, we will be automatically deleting these messages<br />"*/
  /*+ "within the next couple of weeks.  Save any important messages to your<br />"*/
  /*+ "own PC some time this week.";*/

  /*var style = DwtMessageDialog.INFO_STYLE;*/

  /*this._dialog =  appCtxt.getMsgDialog();*/
  /*this._dialog.reset();*/
  /*this._dialog.setMessage(message, style);*/
  /*this._dialog.popup();*/
}
