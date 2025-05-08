import fs from 'fs';
import path from 'path';
import type * as ethers from 'ethers';

const basePath = __dirname;

let base = path.join(basePath, '../');

const makeFile = async (
  location: string,
  destination: string,
  address: string | ethers.Addressable
) => {
  console.log(
    '다음 경로에 abi파일을 만듭니다. : ',
    path.join(base, destination)
  );
  const json = fs.readFileSync(path.join(base, location), {
    encoding: 'utf-8',
  });

  fs.writeFileSync(path.join(base, destination), makeData(json, address));
};

const makeData = (json: string, address: string | ethers.Addressable) => {
  const abi = JSON.parse(json).abi;

  return JSON.stringify({
    abi: abi,
    address: address,
  });
};

export const makeAbi = async (
  contract: string,
  address: string | ethers.Addressable
) => {
  await makeFile(
    `/artifacts/contracts/${contract}.sol/${contract}.json`,
    `/abis/${contract}.json`,
    address
  );
};
