/**
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
 *
 */

import _ from "lodash";
import { hasRequiredScopes } from "../helpers";
import { ChildRouteInterface, FeatureAccessConfigInterface, RouteInterface } from "../models";

/**
 * Utility class for application routes related operations.
 */
export class RouteUtils {

    /**
     * Private constructor to avoid object instantiation from outside
     * the class.
     *
     * @hideconstructor
     */
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    private constructor() { }

    /**
     * Filters the set of enabled routes based on the app config.
     *
     * @param {RouteInterface[]} routes - Routes to evaluate.
     * @param {T} featureConfig - Feature config.
     * @param {string} allowedScopes - Set of allowed scopes.
     * @return {RouteInterface[]} Filtered routes.
     */
    public static filterEnabledRoutes<T>(routes: RouteInterface[],
                                         featureConfig: T,
                                         allowedScopes: string): RouteInterface[] { 

        // Filters features based on scope requirements.
        const filter = (routeArr: RouteInterface[] | ChildRouteInterface[], allowedScopes: string) => {
            return routeArr.filter((route: RouteInterface | ChildRouteInterface) => {
                if (route.children) {
                    route.children = filter(route.children, allowedScopes);
                }

                let feature: FeatureAccessConfigInterface = null;

                for (const [ key, value ] of Object.entries(featureConfig)) {
                    if (key === route.id) {
                        feature = value;

                        break;
                    }
                }

                if (!feature) {
                    return true;
                }

                return hasRequiredScopes(feature, feature?.scopes?.read, allowedScopes);
            });
        };

        return filter(routes, allowedScopes);
    }

    /**
     * Sanitize the routes for UI. Removes unnecessary routes which are not supposed to be
     * displayed on the UI navigation panels.
     *
     * @param {RouteInterface[]} routes - Routes to evaluate.
     * @return {RouteInterface[]} Filtered routes.
     */
    public static sanitizeForUI<T>(routes: RouteInterface[]): RouteInterface[] {

        // Remove any redundant routes.
        const sanitize = (routeArr: RouteInterface[] | ChildRouteInterface[]) => {
            return routeArr.filter((route: RouteInterface | ChildRouteInterface) => {
                if (_.isEmpty(route.children) && !route.path) {
                    return false;
                }

                if (!_.isEmpty(route.children) && !route.path) {
                    const isFurtherNested = route.children.some((item) => item.children);

                    if (isFurtherNested) {
                        route.children = sanitize(route.children);
                    } else {
                        return route.children.some((item) => item.showOnSidePanel);
                    }
                }

                if (route.children) {
                    route.children = sanitize(route.children);
                }

                return route.showOnSidePanel;
            });
        };

        return sanitize(routes);
    }
}
