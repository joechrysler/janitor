<%@ page language="java" import="java.io.*, java.text.*, java.util.*"%>
<%
//=================================================================+
// Search Zimbra for a given user's old emails
//   by  Joe Chrysler
//   for Dennis Hughes
//   @   Saginaw Valley State University
//   in  March 2011
//=================================================================+

try {
  // Bucket of Objects  --  thank you Java
  //=================================================================+
    PrintWriter           output                = response.getWriter();
    String                username              = request.getParameter("username");
    String                result                = "";
    Calendar              calendar              = Calendar.getInstance();
    SimpleDateFormat      dateFormat            = new SimpleDateFormat("MM/dd/yyyy");
    String                ninetyDaysAgo;
    String                oneYearAgo;
    String                baseCommand;
    String                om_command;
    Process               om_process;
    String                om_result             = "0";
    String                ou_command;
    Process               ou_process;
    String                ou_result             = "0";
    BufferedReader        rawOutput;
    String                firstLineOfOutput;



  // Calculate Calendar Dates  --  significant ones
  //=================================================================+
    calendar.add(Calendar.DATE, -1);
    ninetyDaysAgo = dateFormat.format(calendar.getTime());

    calendar.add(Calendar.DATE, -1);
    oneYearAgo = dateFormat.format(calendar.getTime());

  // Testing block  --  remove
  //=================================================================+
    output.println("Hello?");

  // Write zimbra mailbox commands  --  no Java api =(
  //=================================================================+
    baseCommand         = "zmmailbox -z -m " + username + " "
                        + "search -t message "
                        + "-l 9999 ";

    om_command  = baseCommand
                        + "'before:" + oneYearAgo + " "
                        + "not in:/Trash "
                        + "not from:" + username + "' "
                        + "| grep num:";

    ou_command   = baseCommand
                        + "'is:unread "
                        + "before:" + ninetyDaysAgo + " "
                        + "not in:/Trash' "
                        + "not from:" + username + "' "
                        + "| grep num:";


  // Run zimbra mailbox commands  --  still no Java api ='(
  //=================================================================+
    om_process  = Runtime.getRuntime().exec("pwd");
    ou_process  = Runtime.getRuntime().exec("ls -l");

    if (om_process.waitFor() == 0) {
      rawOutput = new BufferedReader(new InputStreamReader(om_process.getInputStream()));
      firstLineOfOutput = rawOutput.readLine();
      om_result = firstLineOfOutput.split(". ")[1];
    }

    if (ou_process.waitFor() == 0) {
      rawOutput = new BufferedReader(new InputStreamReader(ou_process.getInputStream()));
      firstLineOfOutput = rawOutput.readLine();
      ou_result = firstLineOfOutput.split(". ")[1];
    }

    output.println(om_result + " " + ou_result);


} catch (Exception e) {
  e.printStackTrace();
} 
%>
