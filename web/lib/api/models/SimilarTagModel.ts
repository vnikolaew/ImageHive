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
 * @interface SimilarTagModel
 */
export interface SimilarTagModel {
    /**
     * 
     * @type {string}
     * @memberof SimilarTagModel
     */
    tag: string;
    /**
     * 
     * @type {number}
     * @memberof SimilarTagModel
     */
    score: number;
}

/**
 * Check if a given object implements the SimilarTagModel interface.
 */
export function instanceOfSimilarTagModel(value: object): boolean {
    if (!('tag' in value)) return false;
    if (!('score' in value)) return false;
    return true;
}

export function SimilarTagModelFromJSON(json: any): SimilarTagModel {
    return SimilarTagModelFromJSONTyped(json, false);
}

export function SimilarTagModelFromJSONTyped(json: any, ignoreDiscriminator: boolean): SimilarTagModel {
    if (json == null) {
        return json;
    }
    return {
        
        'tag': json['tag'],
        'score': json['score'],
    };
}

export function SimilarTagModelToJSON(value?: SimilarTagModel | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'tag': value['tag'],
        'score': value['score'],
    };
}

