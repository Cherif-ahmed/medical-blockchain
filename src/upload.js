// // import process from 'process'
// // import minimist from 'minimist'
import { Web3Storage, getFilesFromPath } from 'web3.storage'

// App={
//     uploadFile: async() =>uploadFile()
// }

async function uploadFile() {

    const args = ["./style.css"];
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFkYmVEZDkyYzIxMzRFNkYwQ2NmM0IwQ2I4YmI5MWFCMDE2YzkxYUEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTI1MjQ2OTg2MTYsIm5hbWUiOiJNZWRBcHAifQ.6rPnEcNF5duHn1OqdYdCICNQTWWvLe15ZpCSBPtvT88";

    if (!token) {
        return console.error('A token is needed. You can create one on https://web3.storage')
    }

    if (args._.length < 1) {
        return console.error('Please supply the path to a file or directory')
    }

    const storage = new Web3Storage({ token })
    const files = []

    for (const path of args._) {
        const pathFiles = await getFilesFromPath(path)
        files.push(...pathFiles)
    }

    console.log(`Uploading ${files.length} files`)
    const cid = await storage.put(files)
    console.log('Content added with CID:', cid)

}

function myFunction() {
    document.getElementById("demo").innerHTML = "Hello World";
}

