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
    //output.println("Hello?");

  // Write zimbra mailbox commands  --  no Java api =(
  //=================================================================+
    baseCommand         = "/opt/zimbra/bin/zmmailbox -z -m " + username + " "
                        + "search -t message "
                        + "-l 9999 ";

    String cmd[] = {"/opt/zimbra/bin/zmmailbox", "-z", "-m " + username, "search", "-t message", "-l 9999"};
    

    om_command  = baseCommand
                        + "'before:" + oneYearAgo + " "
                        + "not in:/Trash "
                        + "not from:" + username + "' ";

    ou_command   = baseCommand
                        + "'is:unread "
                        + "before:" + ninetyDaysAgo + " "
                        + "not in:/Trash' "
                        + "not from:" + username + "' "
                        + "| grep num:";


  // Run zimbra mailbox commands  --  still no Java api ='(
  //=================================================================+
    //om_command = "pwd";
    output.println(cmd[0]);
    output.println("<br /> before invoking");
    try {
      om_process  = Runtime.getRuntime().exec(cmd);
      om_process.waitFor();
      output.println(cmd[0] + " returned " + om_process.exitValue());
    } catch (Throwable t) {
      t.printStackTrace();
     //output.println("error executing " + cmd[0]);
     //output.println(e);
    }
      //ou_process  = Runtime.getRuntime().exec(ou_command);

//      output.println("<br />before process");
 //     int lazy = om_process.waitFor();
 //     if (lazy == 0) {
 //     output.println("started process");
 //       rawOutput = new BufferedReader(new InputStreamReader(om_process.getInputStream()));
 //       firstLineOfOutput = rawOutput.readLine();
 //       //om_result = firstLineOfOutput.split(". ")[1];
 //       om_result = firstLineOfOutput;
 //       //om_result = "7";
 //       output.println(om_result);
 //     } else {
 //       output.println("om failed");
 //     }
 //     output.println("<br />after process");
 //   //  output.println("error executing " + cmd[0]);
 //   output.println(cmd[0] + " returned " + om_process.exitValue());

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
