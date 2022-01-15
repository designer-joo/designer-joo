
//익명함수를 써서 전역함수와 충돌 되지 않게 ! 
(()=>{
   let YOffset = 0; //window.pageYOffset 의 변수
   let prevScrollHeight = 0; //현재 스크롤 위치(YOffset의 값) 보다 이전에 스크롤 된 섹션들의 높이의 합
   let currentScene = 0; // 현재 활성화 된 (눈앞에 보고있는) 씬(scroll-section)
   let enterNewScene = false; // 새로운 씬이 시작된 순간 true

   const sceneInfo = [
    //section-0
    {
        type : 'sticky', //애니메이션 효과있음
        heightNum : 5, //브라우저 높이의 기준으로 5배로 각 섹션당 스크롤을 임의로 세팅
        scrollHeight : 0, //일단 제로 세팅
        objs : {
            container : document.querySelector('#scroll-section-0'),
            messageA : document.querySelector('#scroll-section-0 .main-message.a'),
            messageB : document.querySelector('#scroll-section-0 .main-message.b'),
            messageC : document.querySelector('#scroll-section-0 .main-message.c'),
            messageD : document.querySelector('#scroll-section-0 .main-message.d')
        },
        values : {
            messageA_Opacity_in:[0, 1, { start:0.1, end:0.2 }], 
            messageB_Opacity:[0, 1, { start:0.3, end:0.4 }],
            messageA_Opacity_out:[1, 0, { start:0.25, end:0.3 }]

        }
    },
    //section-1
    {
        type : 'normal', //애니메이션 효과없음
        heightNum : 5, //브라우저 높이의 기준으로 5배로 각 섹션당 스크롤을 임의로 세팅
        scrollHeight : 0, //일단 제로 세팅
        objs : {
            container : document.querySelector('#scroll-section-1')
        }
    },    
    //section-2
    {
        type : 'sticky', //애니메이션 효과있음
        heightNum : 5, //브라우저 높이의 기준으로 5배로 각 섹션당 스크롤을 임의로 세팅
        scrollHeight : 0, //일단 제로 세팅
        objs : {
            container : document.querySelector('#scroll-section-2')
        }
    },   
    //section-3
    {
        type : 'sticky', //애니메이션 효과있음
        heightNum : 5, //브라우저 높이의 기준으로 5배로 각 섹션당 스크롤을 임의로 세팅
        scrollHeight : 0, //일단 제로 세팅
        objs : {
            container : document.querySelector('#scroll-section-3')
        }
    }

   ];


   function setLayout(){
     for(let i = 0; i < sceneInfo.length; i++){
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum * window.innerHeight;
        sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
     }

     // 새로고침 할 때 ID에 맞게 현재 씬넘버에 해당되는 sticky-elem 불러오기
     let totlaScrollHeight = 0;
     for(let i = 0; i < sceneInfo.length; i++){
         totlaScrollHeight = totlaScrollHeight + sceneInfo[i].scrollHeight;
         if(totlaScrollHeight >= YOffset){
             currentScene = i;
            break;
         }
     }
     
    document.body.setAttribute('id', `show-scene-${currentScene}`);
     
}

 
// function scrollLoop(){
//     prevScrollHeight = 0;
//     for(let i=0; i < sceneInfo.length; i++){
//         //이전 스크롤높이의 합은 = 0 + 각 섹션마다 디바이스 높이에 *5한 값을 지정했는데, 그것을
//         //sceneInfo인 각 섹션0,1,2,3마다 돌아가며 더한 값을 console.log에 찍어주라는 뜻,
//         prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
//     }
//     console.log(prevScrollHeight);
// }

//스크롤할때 펑션
function scrollLoop(){
    enterNewScene = false;
    prevScrollHeight=0;//값이 누적이 안되게 지정
    
    for(let i = 0; i < currentScene; i++){
        prevScrollHeight = prevScrollHeight + sceneInfo[i].scrollHeight;
    }
    if(YOffset > prevScrollHeight + sceneInfo[currentScene].scrollHeight){
        enterNewScene = true;
        currentScene++;
       
       //해당 바디 ID에 맞게 현재 씬넘버에 해당되는 sticky-elem 불러오기 
       document.body.setAttribute('id', `show-scene-${currentScene}`);
    }
   if(YOffset < prevScrollHeight){
     enterNewScene = true;  
     if(currentScene === 0) return; //웹이 바운스될때 (모바일에서) 현재씬넘버가 꼬이지않게 카운트 금지 리턴!
        currentScene--;
       //해당 바디 ID에 맞게 현재 씬넘버에 해당되는 sticky-elem 불러오기 
     document.body.setAttribute('id', `show-scene-${currentScene}`);
    if(enterNewScene) return;{
        playanimation();
        
    }
    
    
    
    }




   // opacity 값을 조정함 
   // 각 현재 얼마나 스크롤(currentYOffset)이 되는지 비율로 구해야함
function calcValues(values, currentYOffset){
    let rv;
    
   //현재 씬 (스크롤섹션)에서 스크롤 된 영역구하기
   const scrollHeight = sceneInfo[currentScene].scrollHeight
   const scrollRatio = currentYOffset / scrollHeight;
     

   if(values.length === 3){
      //start ~ end 가 있는경우    
     const partScrollStart = values[2].start * scrollHeight;
     const partScrollEnd = values[2].end * scrollHeight;
     const partScrollHeight = partScrollEnd - partScrollStart;
     
      if(currentYOffset >= partScrollStart && currentYOffset <= partScrollEnd){
        rv  = ((currentYOffset - partScrollStart) / partScrollHeight * (values[1] - values[0]) + values[0] );
      }
      else if(currentYOffset < partScrollStart){
          rv = values[0];
      }
      else if(currentYOffset > partScrollEnd){
        rv = values[1];
    }
   }
   else{
     rv  = ( scrollRatio * (values[1] - values[0]) + values[0] );
   }


   return rv;
}   

function playanimation(){
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = YOffset-prevScrollHeight;
    
       

    switch(currentScene){
        case 0:
        // console.log('play0');
        const messageA_Opacity_in = calcValues(values.messageA_Opacity_in, currentYOffset);
        const messageA_Opacity_out = calcValues(values.messageA_Opacity_out, currentYOffset);
        objs.messageA.style.opacity = messageA_Opacity_in;
        console.log(messageA_Opacity_in);
        break;

        case 1:
        // console.log('play1');
        break;

        case 2:
        // console.log('play2');    
        break;

        case 3:
        // console.log('play3');    
        break;

    }
}
playanimation();

}





window.addEventListener('scroll',() =>{
    YOffset = window.pageYOffset;
    scrollLoop();
});

window.addEventListener('resize', setLayout);
window.addEventListener('load', setLayout);

setLayout();
   
})();
