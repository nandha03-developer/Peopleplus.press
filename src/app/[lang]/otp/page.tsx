"use client"
 
import React from 'react'
import Otp from './otpComponent'
 
import Head from 'next/head'
import Layout from '@/components/ltr/layout/layout'
 
function index() {
  //const lang = params.lang

  return (
    <Layout>
    <div>
      <Head>
        <title>OTP</title>
        <meta
          name="otp"
          content="At LaabamOne, we are more than just creators of software; we are architects of transformation"
          key="desc"
        />
      </Head>
     
      <Otp />
      </div>
      </Layout>
  )
}
 
export default index