import React from 'react';
import { Input } from '@nextui-org/react';

export default function SearchBox() {
  return (
    <>
      <Input
        clearable
        contentRightStyling={false}
        placeholder="请输入查询信息"
        size='xl'
        width='100vh'
        css={{marginLeft: "100px", marginRight: "100px", marginTop: "200px"}}
      />
    </>
  );
}