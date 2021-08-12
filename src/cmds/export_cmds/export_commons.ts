import fs, { PathLike } from "fs";
import path from "path";

// lodash methodes
import isArray from "lodash/isArray";
import isString from "lodash/isString";
import groupBy from "lodash/groupBy";
import uniq from "lodash/uniq";

// For typings
import type { Argv } from "yargs";
import { CommonExportArguments, I18N_Merged_Data } from "../../types/exportTypes"
type I18N_Object = { [x: string]: string | Array<any> | I18N_Object }
type I18N_Result = {
    "technical_key": string,
    "label": string,
    "locale": string
}[]

// configure export commands with the common options in the builder step
export function setUpCommonsOptions(y: Argv) {
    return y
        .option("files", {
            describe: "Path to a JSON object that have as key an unique identifier and value the absolute path to a i18n file, such as : { \"FR\": \"/somePath/fr.json\", \"NL\": \"/somePath/nl.json\"}",
            demandOption: true
        })
        .option("filename", {
            type: "string",
            alias: "of",
            describe: "Name of the output file generated by this CLI (without extension)"
        })
        .option("outputDir", {
            type: "string",
            alias: "od",
            describe: "Output folder where to store the output file",
            default: process.cwd()
        })
        // default value for filename
        .default("filename", function() {
            const date = new Date();
            const timestamp = `${date.getDay() + 1}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}h${date.getMinutes()}m${date.getSeconds()}`;
            return `translations_${timestamp}`;
        })
        .config('settings', function (configPath) {
            return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
        })
        // coerce path provided by outputDir
        .coerce(["outputDir"], path.resolve)
        // convert JSON inline, if present
        .coerce(["files"], (arg) => {
            if (isString(arg)) {
                // arg is a Path, convert it into a JSON
                return JSON.parse(fs.readFileSync(arg, 'utf-8'));
            } else {
                // arg is an object thanks to settings
                return arg;
            }
        })
        // validation for filename option
        .check( async (argv) => {
            let filename : unknown = argv["filename"];
            if (path.extname(filename as string).length !== 0) {
                throw new Error(`${filename} has an extension : Remove it please`);
            }
            return true;
        })
        // validation(s) for files option
        .check( async (argv) => {
            let files = argv.files as Object;
            let entries : [String, any][] = Object.entries(files);
            if (entries.length === 0) {
                throw new Error("Option files should have at least one entry");
            }
            if (uniq(Object.values(files)).length !== entries.length) {
                throw new Error(`At least a duplicated value in files JSON object was detected`);
            }
            await Promise.all(
                entries.map(
                    ([_, i18nPath]) => Promise.all([
                        // check if file is a valid file path
                        fs.promises.access(i18nPath),
                        // check if the file is a JSON
                        new Promise((resolve, reject) => {
                            fs.promises
                                .readFile(i18nPath)
                                .then( potentialJSON => {
                                    try {
                                        JSON.parse(potentialJSON.toString());
                                        resolve(undefined);
                                    } catch(_) {
                                        reject(`${i18nPath} isn't a valid JSON`);
                                    }
                                })
                                .catch(err => reject(err))
                        })
                    ])
                )
            )
            // validated
            return true;
        })
}

// turns n i18n file(s) into a merged version
export function merge_i18n_files(argv : CommonExportArguments) : Promise<I18N_Merged_Data> {
    return new Promise( (resolve, reject) => {
        Promise
            // Read files and convert them to useful obj
            .all(
                Object
                    .entries(argv.files)
                    .map(entry => readFile(entry))
            )
            // merge results
            .then(results => mergeResults(results))
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}

// merge_i18n_files sub functions

// read file and turning into a useful array of objects
function readFile([locale, file_path] : [string, PathLike]) : Promise<I18N_Result> {
    return new Promise((resolve, reject) => {
        fs.promises.readFile(file_path, 'utf8')
            .then(jsonData => Promise.resolve(JSON.parse(jsonData)))
            .then(json => i18n_to_result_format(json, "", locale))
            .then(result => resolve(result))
            .catch(err => reject(err));        
    });
}

// turning a i18n into a useable object for later group by
const flat = (arr: any[]) => [].concat(...arr);

// 
function i18n_to_result_format(obj : I18N_Object, prefix = "", locale = "") : I18N_Result {
    return flat(
        Object
            .keys(obj)
            .map(key => {
                let val = obj[key];
                let technicalKey = `${prefix}.${key}`
                // terminal condition first
                if (isString(val)) {
                    return {"technical_key": technicalKey, "label": val, "locale": locale}
                } else if (isArray(val)) {
                    // hardly ever saw that in a i18n file but better prevent than care
                    return val.map( (item, index) => i18n_to_result_format(item, `${technicalKey}[${index}]`,locale)) 
                } else {
                    return i18n_to_result_format(val, technicalKey, locale);
                }
        })
    );
}

// merge array of {"technical_key": "...", "label": "...", "locale": "..."}
// into {"technical_key": ..., "labels": { "FR": ..., "NL": ..., "DE": ... }}
function mergeResults(results : I18N_Result[]) : Promise<I18N_Merged_Data> {
    let groupBy_technical_key = groupBy(flat(results), 'technical_key');

    let final_result = Object
        .keys(groupBy_technical_key)
        .sort()
        .map(key => {
            return {
                "technical_key": key, 
                "labels": groupBy_technical_key[key]
                    .reduce( (prev, curr) => {
                        prev[curr["locale"]] = curr["label"];
                        return prev;
                    }, {})
            }
        });
    return Promise.resolve(final_result);
}