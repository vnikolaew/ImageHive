/* tslint:disable */
/* eslint-disable */
/**
 * Image Hive
 * This is private docs
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface SimilarTagsResponse
 */
export interface SimilarTagsResponse {
    /**
     * 
     * @type {Array<string>}
     * @memberof SimilarTagsResponse
     */
    similarTags: Array<string>;
}

/**
 * Check if a given object implements the SimilarTagsResponse interface.
 */
export function instanceOfSimilarTagsResponse(value: object): boolean {
    if (!('similarTags' in value)) return false;
    return true;
}

export function SimilarTagsResponseFromJSON(json: any): SimilarTagsResponse {
    return SimilarTagsResponseFromJSONTyped(json, false);
}

export function SimilarTagsResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): SimilarTagsResponse {
    if (json == null) {
        return json;
    }
    return {
        
        'similarTags': json['similar_tags'],
    };
}

export function SimilarTagsResponseToJSON(value?: SimilarTagsResponse | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'similar_tags': value['similarTags'],
    };
}

