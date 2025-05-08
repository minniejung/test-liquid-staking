'use client'

import { createContext, useContext } from 'react'

import { JsonRpcProvider } from 'ethers'

const provider = new JsonRpcProvider('https://public-en-kairos.node.kaia.io')

export const EthersContext = createContext({
	provider,
})

export const useEthers = () => useContext(EthersContext)

export const EthersProvider = ({ children }: { children: React.ReactNode }) => {
	return <EthersContext.Provider value={{ provider }}>{children}</EthersContext.Provider>
}
