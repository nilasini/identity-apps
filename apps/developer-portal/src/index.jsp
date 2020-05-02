<!--
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the "License"); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
-->

<%= htmlWebpackPlugin.options.importUtil %>
<%= htmlWebpackPlugin.options.importTenantPrefix %>
<%= htmlWebpackPlugin.options.importSuperTenantConstant %>

<!DOCTYPE HTML>
<html>
    <head>
        <%= htmlWebpackPlugin.options.contentType %>
        <meta charset="utf-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>
        <meta name="referrer" content="no-referrer" />

        <link href="<%= htmlWebpackPlugin.options.publicPath %>/libs/themes/default/theme.min.css" rel="stylesheet" type="text/css"/>

        <title><%= htmlWebpackPlugin.options.title %></title>

        <!-- runtime config -->
        <script src="<%= htmlWebpackPlugin.options.publicPath %>/runtime-config.js"></script>
        <!-- runtime config -->

        <script>
            var getTenantPrefix = function() {
                return "<%= htmlWebpackPlugin.options.tenantPrefix %>";
            };

            var getSuperTenant = function() {
                return "<%= htmlWebpackPlugin.options.superTenantConstant %>";
            };

            var getTenantName = function() {
                var paths = window.location.pathname.split("/");
                var tenantIndex = paths.indexOf(getTenantPrefix());

                if (tenantIndex > 0) {
                    var tenantName = paths[tenantIndex + 1];
                    return (tenantName) ? tenantName : "";
                } else {
                    return "";
                }
            };

            var getTenantPath = function(tenantName) {
                return (tenantName !== "") ? "/" + getTenantPrefix() + "/" + tenantName : "";
            };

            /**
            * =====================================================
            * Configure your portal settings
            * =====================================================
            */

            // Add applications which are not to be deleted in to this array.
            var doNotDeleteApplications = ["Developer Portal", "User Portal"];

            /**
             * =====================================================
             * Update below details according to your configuration
             * =====================================================
             */

            // Update below with tenant developer-portal application/service-provider details
            var serverOriginAddress = "<%= htmlWebpackPlugin.options.serverUrl %>";
            var clientOriginAddress = "<%= htmlWebpackPlugin.options.serverUrl %>";

            var tenantName = getTenantName();
            var defaultDeveloperPortalClientID = "DEVELOPER_PORTAL";
            var tenantDeveloperPortalClientID = defaultDeveloperPortalClientID + "_" + tenantName;

            var defaultUserPortalClientHost = serverOriginAddress + getTenantPath(tenantName);
            var defaultUserPortalBaseName = "user-portal";
            var defaultMyAccountPath = "/personal-info";

            /** ===================================================== */

            if (!window.userConfig) {
                window.userConfig = {};
            }

            window["runConfig"] = {
                appBaseName: window.userConfig.appBaseName || getTenantPath(tenantName) + 
                    "<%= htmlWebpackPlugin.options.publicPath %>",
                appBaseNameWithoutTenant: window.userConfig.appBaseNameWithoutTenant ||
                    "<%= htmlWebpackPlugin.options.publicPath %>",
                clientHost: window.userConfig.clientHost || clientOriginAddress + getTenantPath(tenantName),
                clientOrigin: window.userConfig.clientOrigin || clientOriginAddress,
                clientID: window.userConfig.clientID ||
                    (getTenantPath(tenantName) === ("/" + getTenantPrefix() + "/" + tenantName)) ?
                    tenantDeveloperPortalClientID : defaultDeveloperPortalClientID,
                doNotDeleteApplications: doNotDeleteApplications || [],
                myAccountPath: window.userConfig.myAccountPath || defaultMyAccountPath,
                serverHost: window.userConfig.serverHost || serverOriginAddress + getTenantPath(tenantName),
                serverOrigin: window.userConfig.serverOrigin || serverOriginAddress,
                tenant: window.userConfig.tenant || (tenantName === "") ? getSuperTenant() : tenantName,
                tenantPath: window.userConfig.tenantPath || getTenantPath(tenantName),
                userPortalBaseName: window.userConfig.userPortalBaseName || defaultUserPortalBaseName,
                userPortalClientHost: window.userConfig.userPortalClientHost || defaultUserPortalClientHost
            };
        </script>
    </head>
    <body>
        <noscript>
            You need to enable JavaScript to run this app.
        </noscript>
        <div id="root"></div>
    </body>
</html>