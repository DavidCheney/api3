const Posts = [
  {
    'id':'0176413761b289e6d64c2c14a758c1c7',
    'author_id':'0hy894hf0dlkfh9oinv',
    'author':'alonso', 
    'category':'meteor',
    'title':'a title',
    'body':'sample body'
  },  
  {
    'id':'03390abb5570ce03ae524397d215713b',
    'author_id':'0hy894hf0dlkfh9oinv',
    'author':'alonso', 
    'category':'product',
    'title':'a title',
    'body':'sample 2'
  },  
  {
    'id':'19085291c89f0d04943093c4ff16b664',
    'author_id':'8dlx7ak38fd39dv79ad',
    'author':'orinami', 
    'category':'product',
    'title':'a title',
    'body':'body3'
    },
  {
    'id':'1afff9dfb0b97b5882c72cb60844e034',
    'author_id':'8dlx7ak38fd39dv79ad',
    'author':'orinami',
    'category':'product',
    'title':'a title',
    'body':'You might have seen the [EventLoop Utilization](http://support.kadira.io/knowledgebase/articles/372876-event-loop-utilization) chart in our Dashboard. But, it was not correctly working across different hosting platforms. Actually, that value does not reflect any meaning in some situations.\n\n![CPU Usage tracking with Kadira](https://i.cloudup.com/eisfJAuiJW.gif)\n\n'
    },
  {
    'id':'1bd16dfab1de982317d2ba4382ec8c86',
    'author_id':'8dlx7ak38fd39dv79ad',
    'author':'orinami',
    'category':'meteor',
    'title':'a title',
    'body':'Today is holiday for Sri Lanka. But for me, it\'s a hackday. I started playing with React and wrote few simple apps. That\'s a nice experience.\n\nSo, I started thinking why not trying to implement SSR support. It\'s worth trying since now we\'ve all the tools we need.\n\n**Guys, It was a successful experience. Now we\'ve pure SSR support for Meteor.**\n\n### How It Works.\n\n'
    },
  {
    'id':'285292901bb38be8f57dd2885c517826',
    'author_id':'8dlx7ak38fd39dv79ad',
    'author':'orinami',
    'category':'user-story',
    'title':'a title',
    'body':'[Brent Abrahams](http://cn.linkedin.com/pub/brent-abrahams/87/372/ba1) is a mathematics teacher who has build an online curriculum management app [Standbench](http://cn.linkedin.com/pub/brent-abrahams/87/372/ba1) for his organization using Meteor. He has a [nice story](http://meteorhacks.com/meteor-in-production-a-case-study.html) with the initial stage of his applications and how he used Oplog with his application.\n\n'
    },
  {
    'id':'2f6b59fd0b182dc6e2f0051696c70d70',
    'author_id':'8dlx7ak38fd39dv79ad',
    'author':'orinami',
    'category':'other',
    'title':'a title',
    'body':'This is a short guide to remind you about means, histograms and percentiles in statistics. Then, we will discuss why all these matter and when we can use each of them.\n\n## Our Data Set\n\nFirst, we need a data set so we can calculate these measurements. We will look at a collection of response times collected over a minute from a web app. ![](https://cldup.com/QM0ghRvB-a.png)\n\nHere, the 99th percentile is very high compared with the other percentiles, which indicates that there is an outlier.\n\nBut interestingly, our 90th and 95th percentiles are also quite high. So, that seems like a problem.\n\n\u003e Normally, we try to reduce response times. That\'s why we never look at lower percentile values like the 5th percentile. But, depending on your data set, you can pick any percentile you want.\n\nFor the response time, we usually look at the median, the 90th, 95th and 99th percentiles. It\'s up to you to decide which percentile you are going to look at. \n\nIf the response time is very critical to your app, you can try to reduce the 99th percentile. Otherwise, you could try to optimize the response time for the 90th or 95th percentile.\n\nIf you are really not worried about the response time, you could try to optimize the median.','date':{'$date':'2015-08-24T00:00:00.000Z'},'layout':'blog_post','slug':'mean-histogram-and-percentiles','summary':'A short guide to means, histograms and percentiles and how we can use them in a real situation.','title':'Understanding Mean, Histogram and Percentiles'},
];

module.exports = Posts;
