import React, { FunctionComponent, useState } from 'react';
import { LuaFactory } from 'wasmoon'
import Player from '../components/Player';

const LuaContext = React.createContext({
  lua: null
})

const LuaContextProvider: FunctionComponent = ({ children }) => { 
  const [lua, setLua] = useState<any>()
  const factory = new LuaFactory();
  
  const test = async () => {
    setLua(await factory.createEngine())
  }

  if (!lua) {
    test()
  }
  
  return (
    <LuaContext.Provider value={{ lua }}>{children}</LuaContext.Provider>
  );
}

export { LuaContextProvider, LuaContext }