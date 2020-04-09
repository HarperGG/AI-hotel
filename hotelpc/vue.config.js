

module.exports = {
  devServer: {
    /**
     * 这一块是devServer的配置，可以参考https://webpack.js.org/configuration/dev-server/
     * (可选，根据自己情况来设置)
     */
    open: true, //浏览器自动打开页面
    host: "localhost", //本地服务器访问的路径
    port: 8080, //本地服务器访问的端口

    /**
     * vue-cli3跨域的全配置！
     */
    proxy: {
      /**
       * (推荐这种方式)
       * 这里是域名后面需要访问的部分(最原始的跨域方式！),！
       * 跨域域名https://baike.baidu.com/后面的访问目录！
       * 在axios路径中写入/article目录下要访问的具体内容路径即可，如果：/article/d4666d640e2e478d283d8c7f.htm即可
       * 
       */
      '/article': {
        //你要跨域的域名(包含host、端口号,切记：一定要带上http头);
        //同一个域名只能设置一次跨域，否则重复报错！
        target: 'http://jiangwei.online:8080',
        changeOrigin: true, //是否跨域，设置为true;(必须)
        /* 对应的axios路径设置：
        axios.get( "/article/d4666d640e2e478d283d8c7f.htm" )
            .then( function ( response ) {
                console.log( response.data );
            } )
            .catch( function ( error ) {
                throw error;
            } );
        */
      },


    }
  }
};

