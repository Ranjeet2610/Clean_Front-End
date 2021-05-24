import tempJson from '../widgets/temp.json'
export const sortDataByName = (marketData, dataList) => {
    const sequence = [ "Match Odds", "Over/Under 2.5 Goals", "Over/Under 1.5 Goals", "Bookmaker" ]
    // let dataList = [...dataListO, ...tempJson]
    console.log('dataList',marketData, dataList );

    let collect = []
    let rest = []
    // Set Market Name
    // for (let i = 0; i < marketData?.length; i++) {
    //     rest = []
    //     const marketObj = marketData[i]?.marketData;

    //     for (let j = 0; j < dataList.length; j++) {
    //         const odsDataList = dataList[j];
    //         for (let k = 0; k < odsDataList.odsData?.length; k++) {
    //             const dataObj = odsDataList?.odsData[k];

    //             if (marketObj.marketId == dataObj.marketId) {
                    // odsDataList.marketName = marketObj.marketName
                    // sortByName(marketObj.marketName, j) ? 
                    // collect = [...collect, odsDataList] : 
                    // rest = [...rest, odsDataList]
    //             }
    //         }

    //     }
    // }
    // return new Promise((res,rej)=>(res([...collect, ...rest])))

    return new Promise((resolve, reject)=>{
        
        for (let a = 0; a < sequence.length; a++) {
            const mName = sequence[a];

            //find 
            
        }



        resolve([])

    })
}


// const sortByName = (marketName , index) => {
//     console.log(marketName , index);
//     if(marketName ===  && index == 0){
//         return true
//     }else if(marketName ===  && index == 1){
//         return true
//     }else if(marketName ===  && index == 2){
//         return true
//     }else if(marketName ===  && index == 3){
//         return true
//     }else if(marketName === "toss" && index == 4){
//         return true
//     }else{
//         return false
//     }
    
// }