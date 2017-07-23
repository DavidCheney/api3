
Visualization:
http://172.29.161.196:4000/graph.html

Refs:
https://apis.guru/graphql-voyager/
http://nathanrandal.com/graphql-visualizer/


Patched to allow vertical space for zoom:
- vi node_modules/graphql-voyager/src/components/Voyager.css to remove height:100% from .graphql-voyager>.viewport>svg
- dist/voyager.min.js changed "Transmitting ..." to "Zoom renders below  vvvvv" 