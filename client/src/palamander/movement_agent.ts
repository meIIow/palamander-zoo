// useEffect(() => {
//   let count = 1;
//   let angle = 0;
//   let dir = 1;
//   let offset = {
//     x: 0,
//     y: 0
//   };
//   let speed = 0;
//   console.log(console.time());
//   const intervalId = setInterval(() => {
//     const rand = Math.random();
//     console.log(rand)
//     if (rand < 0.05) {
//         dir ++;
//         dir = dir % 3;
//     }
//     if (rand > 0.95) {
//         dir --;
//         dir = dir % 3;
//     }
//     angle += 5 * (dir - 1);

//     // Calculate Speed
//     const randS = Math.random();
//     if (randS > 0.9) {
//         // keep same speed 90% of the time
//         if (randS > 0.98) {
//             // stop suddenly
//             speed = 4
//         }
//         else if (randS > 0.96) {
//             // slow
//             speed = speed / 2
//         }
//         else if (randS > 0.94) {
//             speed += 4
//         }
//         else if (randS > 0.92) {
//             speed += 8
//         }
//         else {
//             speed += 0
//         }
//     }

//     const xd = Math.sin(angle * Math.PI / 180) * speed;
//     const yd = Math.cos(angle * Math.PI / 180) * speed;
//     offset.x -= xd;
//     offset.y -= yd;

//     //const engineSegmentCircle = createEngineSegmentCircle(offset);
//     const engineSegmentCircle = createEngineSegmentCircle({x:0,y:0});


//     count += 1
//     animate(count, 0, engineSegmentCircle);
//   }, 100);
//   return () => clearInterval(intervalId); // Cleanup on unmount
// }, []);