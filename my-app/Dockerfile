FROM tomcat:9-jdk11

# Remove default ROOT folder
RUN rm -rf /usr/local/tomcat/webapps/ROOT

# Copy your war file
COPY loginpage.war /usr/local/tomcat/webapps/ROOT.war

EXPOSE 8080

CMD ["catalina.sh", "run"]

