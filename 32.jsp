<%@ page language="java" import="java.io.*, java.text.*, java.util.*"%>
<%
//=================================================================+
// Search Zimbra for a given user's old emails
//   by  Joe Chrysler
//   for Dennis Hughes
//   @   Saginaw Valley State University
//   in  March 2011
//=================================================================+

  // Bucket of Objects  --  thank you Java
  //=================================================================+
  try {
    PrintWriter           output                = response.getWriter();
    String                username              = request.getParameter("username");
    String                result                = "";
    Calendar              calendar              = Calendar.getInstance();
    SimpleDateFormat      dateFormat            = new SimpleDateFormat("MM/dd/yyyy");
    String                ninetyDaysAgo;
    String                oneYearAgo;
    String                baseCommand;
    String[]              om_command;
    String                om_filter;
    Process               om_process;
    String                om_result             = "0";
    String[]              ou_command;
    String                ou_filter;
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
    //output.println("Hello?");

  // Write zimbra mailbox commands  --  no Java api =(
  //=================================================================+
    baseCommand         = "/opt/zimbra/bin/zmmailbox -z -m " + username + " "
                        + "search -t message "
                        + "-l 9999 ";

    om_filter   = "before:" + oneYearAgo + " not in:/Trash";
    ou_filter   = "is:unread before:" + ninetyDaysAgo + " not in:/Trash";

    om_command  = new String[] {"/opt/zimbra/bin/zmmailbox",
                                "-z",
                                "-m",
                                username,
                                "search",
                                "-t",
                                "message",
                                om_filter};

    ou_command  = new String[] {"/opt/zimbra/bin/zmmailbox",
                                "-z",
                                "-m",
                                username,
                                "search",
                                "-t",
                                "message",
                                ou_filter};

  // Run zimbra mailbox commands  --  still no Java api ='(
  //=================================================================+
    try {
      om_process  = Runtime.getRuntime().exec(om_command);
      om_process.waitFor();
      rawOutput = new BufferedReader(new InputStreamReader(om_process.getInputStream()));
      firstLineOfOutput = rawOutput.readLine();
      om_result = firstLineOfOutput.split(". ")[1];
      output.println(om_result);
    } catch (Throwable t) {
      t.printStackTrace();
    }
    try {
      ou_process  = Runtime.getRuntime().exec(ou_command);
      ou_process.waitFor();
      rawOutput = new BufferedReader(new InputStreamReader(ou_process.getInputStream()));
      firstLineOfOutput = rawOutput.readLine();
      ou_result = firstLineOfOutput.split(". ")[1];
      output.println(ou_result);
    } catch (Throwable t) {
      t.printStackTrace();
    }

   /* if (ou_process.waitFor() == 0) {
      rawOutput = new BufferedReader(new InputStreamReader(ou_process.getInputStream()));
      firstLineOfOutput = rawOutput.readLine();
      ou_result = firstLineOfOutput.split(". ")[1];
    } else {
      out.println("ou failed");
    }*/

    //output.println(om_result + " Buffer  ");


} catch (Exception e) {
  e.printStackTrace();
} 
%>
