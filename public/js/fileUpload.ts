/**
 * @namespace fileUpload
 * @fileoverview Front-end upload handling functionalities
 */

/**
 * @async
 * @function prepareUpload
 * @description Prepares the file for the upload
 * @memberof fileUpload
 * @param {File} file Object with information of file, which we want to upload
 * @param {string} dataId Id to be used for data node
 */
async function prepareUpload(file: File, dataId: string): Promise<void> {
  // Size of chunk
  const chunkSize = 1024 * 300; //300KB
  const fileChunks: { hash: number; chunk: Blob }[] = [];

  // Index of chunk
  let chunkIndex = 0;
  for (let cur = 0; cur < file.size; cur += chunkSize) {
    fileChunks.push({
      hash: chunkIndex++,
      chunk: file.slice(cur, cur + chunkSize),
    });
  }

  await uploadFileChunks(fileChunks, dataId);
}

/**
 * @async
 * @function uploadFileChunks
 * @description Uploads chunks and merges them, when all have been uploaded
 * @memberof fileUpload
 * @param {Array.<{ hash: number; chunk: Blob }>} fileChunks Array of chunk objects
 * @param {string} dataId Id to be used for data node
 */
async function uploadFileChunks(
  fileChunks: { hash: number; chunk: Blob }[],
  dataId: string
): Promise<void> {
  // Set variable for loading progress
  const loadingProgress = document.getElementById(
    "loading_progress"
  ) as HTMLProgressElement;

  // Merge slices, when all requests are completed
  if (fileChunks.length === 0) {
    if (loadingProgress) {
      loadingProgress.value = 100;
    }
    await fetch(
      "/data/mergeChunks?" +
        new URLSearchParams({
          dataId: dataId,
        })
    );

    return;
  }

  // Set total chunks in upload progress
  (document.getElementById("total_chunks") as HTMLElement).innerText =
    fileChunks.length.toString();

  // Set variables for current chunk
  const currentChunk = document.getElementById("current_chunk") as HTMLElement;

  // Pool of parallel upload promises
  const pool: Promise<Response>[] = [];

  // Maximum of parallel chunk uploads
  const max = 3;

  // Array of failed chunk uploads
  const failList: { hash: number; chunk: Blob }[] = [];

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
      await Promise.race(pool);
    }
  }
}
