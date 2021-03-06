/**
* Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
*
* WSO2 Inc. licenses this file to you under the Apache License,
* Version 2.0 (the 'License'); you may not use this file except
* in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied. See the License for the
* specific language governing permissions and limitations
* under the License.
*/

import { AlertLevels, Claim, TestableComponentInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import { useTrigger } from "@wso2is/forms";
import { DynamicField, EmphasizedSegment, PrimaryButton } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Grid } from "semantic-ui-react";
import { updateAClaim } from "../../../../api";

/**
 * Prop types for `EditAdditionalPropertiesLocalClaims` component
 */
interface EditAdditionalPropertiesLocalClaimsPropsInterface extends TestableComponentInterface {
    /**
     * The Local claim to be edited
     */
    claim: Claim;
    /**
     * The function to be called to initiate an update
     */
    update: () => void;
}

/**
 * This component renders the additional properties pane.
 *
 * @param {EditAdditionalPropertiesLocalClaimsPropsInterface} props - Props injected to the component.
 *
 * @return {React.ReactElement}
 */
export const EditAdditionalPropertiesLocalClaims: FunctionComponent<
    EditAdditionalPropertiesLocalClaimsPropsInterface
    > = (props: EditAdditionalPropertiesLocalClaimsPropsInterface): ReactElement => {

    const {
        claim,
        update,
        [ "data-testid" ]: testId
    } = props;

    const [ submit, setSubmit ] = useTrigger();

    const dispatch = useDispatch();

    const { t } = useTranslation();

    return (
        <EmphasizedSegment>
            <Grid>
                <Grid.Row columns={ 1 }>
                    <Grid.Column tablet={ 16 } computer={ 12 } largeScreen={ 9 } widescreen={ 6 } mobile={ 16 }>
                        <p>{ t("adminPortal:components.claims.local.additionalProperties.hint") }</p>
                        <DynamicField
                            data={ claim.properties }
                            keyType="text"
                            keyName={ t("adminPortal:components.claims.local.additionalProperties.key") }
                            valueName={ t("adminPortal:components.claims.local.additionalProperties.value") }
                            submit={ submit }
                            keyRequiredMessage={ t("adminPortal:components.claims.local.additionalProperties." +
                                "keyRequiredErrorMessage") }
                            valueRequiredErrorMessage={ t("adminPortal:components.claims.local.additionalProperties." +
                                "valueRequiredErrorMessage") }
                            requiredField={ true }
                            update={ (data) => {
                                const claimData = { ...claim };
                                delete claimData.id;
                                delete claimData.dialectURI;
                                const submitData = {
                                    ...claimData,
                                    properties: [ ...data ]
                                }
    
                                updateAClaim(claim.id, submitData).then(() => {
                                    dispatch(addAlert(
                                        {
                                            description: t("adminPortal:components.claims.local.notifications." +
                                                "updateClaim.success.description"),
                                            level: AlertLevels.SUCCESS,
                                            message: t("adminPortal:components.claims.local.notifications." +
                                                "updateClaim.success.message")
                                        }
                                    ));
                                    update();
                                }).catch(error => {
                                    dispatch(addAlert(
                                        {
                                            description: error?.description
                                                || t("adminPortal:components.claims.local.notifications." +
                                                    "updateClaim.genericError.description"),
                                            level: AlertLevels.ERROR,
                                            message: error?.message
                                                || t("adminPortal:components.claims.local.notifications." +
                                                    "updateClaim.genericError.message")
                                        }
                                    ));
                                })
                            } }
                            data-testid={ `${ testId }-form-properties-dynamic-field` }
                        />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={ 1 }>
                    <Grid.Column width={ 6 }>
                        <PrimaryButton
                            onClick={ () => {
                                setSubmit();
                            } }
                            data-testid={ `${ testId }-submit-button` }
                        >
                            { t("common:update") }
                        </PrimaryButton>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </EmphasizedSegment>
    );
};

/**
 * Default props for the component.
 */
EditAdditionalPropertiesLocalClaims.defaultProps = {
    "data-testid": "edit-local-claims-additional-properties"
};
