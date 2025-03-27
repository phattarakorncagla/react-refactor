"use strict";
/**
 * @namespace fileUpload
 * @fileoverview Front-end upload handling functionalities
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/**
 * @async
 * @function prepareUpload
 * @description Prepares the file for the upload
 * @memberof fileUpload
 * @param {File} file Object with information of file, which we want to upload
 * @param {string} dataId Id to be used for data node
 */
function prepareUpload(file, dataId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Size of chunk
        const chunkSize = 1024 * 300; //300KB
        const fileChunks = [];
        // Index of chunk
        let chunkIndex = 0;
        for (let cur = 0; cur < file.size; cur += chunkSize) {
            fileChunks.push({
                hash: chunkIndex++,
                chunk: file.slice(cur, cur + chunkSize),
            });
        }
        yield uploadFileChunks(fileChunks, dataId);
    });
}
/**
 * @async
 * @function uploadFileChunks
 * @description Uploads chunks and merges them, when all have been uploaded
 * @memberof fileUpload
 * @param {Array.<{ hash: number; chunk: Blob }>} fileChunks Array of chunk objects
 * @param {string} dataId Id to be used for data node
 */
function uploadFileChunks(fileChunks, dataId) {
    return __awaiter(this, void 0, void 0, function* () {
        // Set variable for loading progress
        const loadingProgress = document.getElementById("loading_progress");
        // Merge slices, when all requests are completed
        if (fileChunks.length === 0) {
            if (loadingProgress) {
                loadingProgress.value = 100;
            }
            yield fetch("/data/mergeChunks?" +
                new URLSearchParams({
                    dataId: dataId,
                }));
            return;
        }
        // Set total chunks in upload progress
        document.getElementById("total_chunks").innerText =
            fileChunks.length.toString();
        // Set variables for current chunk
        const currentChunk = document.getElementById("current_chunk");
        // Pool of parallel upload promises
        const pool = [];
        // Maximum of parallel chunk uploads
        const max = 3;
        // Array of failed chunk uploads
        const failList = [];
        // Number of finished chunk uploads
        let finish = 0;
        for (let i = 0; i < fileChunks.length; i++) {
            // Set current chunk
            currentChunk.innerText = i.toString();
            // Set loading progress
            loadingProgress.value = (i / fileChunks.length) * 100;
            const formData = new FormData();
            formData.append("dataId", dataId);
            formData.append("hash", fileChunks[i].hash.toString());
            formData.append("chunk", fileChunks[i].chunk);
            // Upload chunk
            const task = fetch("/data/uploadChunk", {
                method: "POST",
                body: formData,
            });
            task
                .then((data) => {
                // Remove the Promise task from the concurrency pool when the request ends
                const index = pool.findIndex((t) => t === task);
                pool.splice(index, 1);
            })
                .catch(() => {
                failList.push(fileChunks[i]);
            })
                .finally(() => {
                finish++;
                // All requests completed
                if (finish === fileChunks.length) {
                    uploadFileChunks(failList, dataId);
                }
            });
            pool.push(task);
            if (pool.length === max) {
                // Each time the concurrent pool finishes running a task, another task is plugged in
                yield Promise.race(pool);
            }
        }
    });
}
