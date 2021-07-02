import React, { useEffect, useState } from 'react'
import BetBox from '../components/Betbox';
import SideBet from '../components/SideBet';
import tv from "../images/tv-screen.png";
import tempJson from './temp.json'
const MatchOddsTable = (props) => {
    // let inplay;
    let filterrunners = [];
    let filteronodsrunners = [];
    let bookitems = [];
    let bookodds;
    let j = 0;
    let avilBlack;
    let availLay;
    let expoProfit;
    let expoLoss;
    let total_team1 = [];
    let total_team2 = [];
    let total_team3 = [];
    let userDetails = JSON.parse(localStorage.getItem("data")) !== undefined ? JSON.parse(localStorage.getItem("data")) : "";
    let showHide = (userDetails.Master !== true && userDetails.Admin !== true && userDetails.superAdmin !== true);
    const [marketName, setMarketName] = useState("")
    const [inPlay, setInPlay] = useState("")
    const [timer, setTimer] = useState("")
    const [state, setstate] = useState({
        ...props,
        ...{
            matchName: props?.matchName || "No Name",
            tableTd: ["0", "0", "0", "0", "0", "0"],
            display:props?.display,
            Mteams:props?.Mteams,
            DMteams:props?.DMteams,
            TBindex:props?.TBindex,
            eventType:props?.eventType,
            betData:props?.betData,
            betProfit:props?.betProfit,
            betLoss:props?.betLoss,
            eventId:props?.eventId,
            runnderData:props?.runnderData,
            expoData:props?.expoData,
            selOdds:props?.selOdds,
            selfancyOdds:props?.selfancyOdds,
            selfancySize:props?.selfancySize,
            IP:props?.IP,
            sportInfo:props?.sportInfo,
            fancyInfo:props?.fancyInfo,
            expoBetProfit:props?.expoBetProfit,
            expoBetLoss:props?.expoBetLoss,
            SoM:props?.SoM,
            isdisabled:props?.isdisabled,
            isTab:props?.isTab,
            isMobile:props?.isMobile,
            playstreaming:props?.playstreaming
        },
        marketData: props?.marketData,

        runners: props?.marketOdds?.runners || props?.pdata, //props.pdata, //[]
        marketOdds: props?.odsData,  //props.odsData //[]

        isenable: props?.isEnabled || false,
        data: props?.pdata, //props?.pdata //[]
        
    });
    useEffect(() => {
        //console.log("state**********************8", state);
        setstate({
            ...props,
            ...{
                matchName: props?.matchName || "No Name",
                tableTd: ["0", "0", "0", "0", "0", "0"],
                display:props?.display,
                Mteams:props?.Mteams,
                DMteams:props?.DMteams,
                TBindex:props?.TBindex,
                eventType:props?.eventType,
                betData:props?.betData,
                betProfit:props?.betProfit,
                betLoss:props?.betLoss,
                eventId:props?.eventId,
                runnderData:props?.runnderData,
                expoData:props?.expoData,
                selOdds:props?.selOdds,
                selfancyOdds:props?.selfancyOdds,
                selfancySize:props?.selfancySize,
                IP:props?.IP,
                sportInfo:props?.sportInfo,
                fancyInfo:props?.fancyInfo,
                expoBetProfit:props?.expoBetProfit,
                expoBetLoss:props?.expoBetLoss,
                SoM:props?.SoM,
                isdisabled:props?.isdisabled,
                isTab:props?.isTab,
                isMobile:props?.isMobile,
                playstreaming:props?.playstreaming
            },
            marketData: props?.marketData,
            runners: props?.marketOdds?.runners || props?.pdata, //props.pdata, //[]
            marketOdds: props?.odsData,  //props.odsData //[]
            inplay: "",
            isenable: props?.isEnabled || false,
            data: props?.pdata, //props?.pdata //[]
        })
    }, [props])
    useEffect(() => {
        //  Status Of the match  
        if (new Date(JSON.parse(localStorage.getItem("matchname")).date).getTime() > new Date().getTime()) {
            setInPlay("GOING IN-PLAY")
        } else {
            setInPlay("IN-PLAY")
        }
        // Set Market Name
        for (let i = 0; i < state.marketData?.length; i++) {
            const marketObj = state.marketData[i]?.marketData;
            if (marketObj.marketId == state.runners[0]?.marketId) {
                setMarketName(marketObj.marketName)
                // console.log("MatketName", marketObj.marketId == state.marketOdds[0]?.marketId, marketObj.marketName);
                return
            } else {
                setMarketName("")
            }

        }

    }, [props])
    state.SoM.length > 0 &&
    state.SoM.map((item, index) => {
        total_team1[item.marketName] = parseFloat(item.T1TotalPL);
        total_team2[item.marketName] = parseFloat(item.T2TotalPL);
        total_team3[item.marketName] = parseFloat(item.T3TotalPL);
    })
    useEffect(() => {
        setTimer(props.timer)
    }, [props.timer])
    return (<div>

        <div className="match_score_box">

            {
                //////////////////////// HEADER OF MATCH ODDS /////////////////////////////////
            }

            <div className="modal-header mod-header">
                <div className="block_box">
                    <span id="tital_change">
                        <span id="fav29905278">
                            <i className="fa fa-star-o" aria-hidden="true" />&nbsp;{state.matchName}
                        </span>
                        <input type="hidden" defaultValue="Match Name" id="sportName_29905278" />
                    </span>
                    <div className="block_box_btn">
                        <button className="btn btn-primary btn-xs"> Bets  </button>
                    </div>
                </div>
            </div>
        </div>

        <div className="sportrow-4 matchOpenBox_1171389306">
            <div className="match-odds-sec">
                <div className="item match-status match-odds"><span class="match-odd-top">{marketName}</span> <span class="sid-image"></span></div>
                <div className="item match-status-odds">
                    <span className="going_inplay green"> {inPlay} </span>
                    <span className="click-tv">
                        {marketName==="Match Odds"?state.isMobile && state.isTab?<img className="tv-icons" onClick={() => props.streamingplay(state.playstreaming)} src={tv} alt="Live Games" />:null:null}
                    </span>
                </div>
                <div className="item match-shedule" id="demo_29905278">{timer}</div>
            </div>

            <div className="fullrow MatchIndentB" style={{ position: "relative" }}>
                <table className={`table table-striped  bulk_actions matchTable1171389306 ${state.isdisabled ? "betting-disabled-placebet" : ""} ${!state.isenable ? "betting-disabled" : ""}`} id="matchTable29905278">
                    <tbody>
                        <tr className="headings mobile_heading">
                            <th className="fix_heading color_red">Min stake:{state.sportInfo?.minStacks} Max stake:{state.sportInfo?.maxStacks}<br></br>
                                {/* Min Odds:{state.sportInfo.minOdds} Max Odds:{state.sportInfo.maxOdds} */}
                            </th>
                            <th> </th>
                            <th> </th>
                            <th className="back_heading_color">Back</th>
                            <th className="lay_heading_color">Lay</th>
                            <th> </th>
                            <th> </th>
                        </tr>
                    </tbody>
                    {
                        state?.data?.length > 0 ?
                            state.runners?.map((item, index) => {
                                filterrunners = state?.data?.filter(newdata => {
                                    return newdata.selectionId === state?.marketOdds[0]?.runners[index]?.selectionId;
                                })
                                if (state.marketOdds?.length > 0) {
                                    let sordataBack = state?.marketOdds[0]?.runners[index]?.ex?.availableToBack.sort(function (a, b) {
                                        return a.price - b.price;
                                    })

                                    if (sordataBack?.length < 3) {
                                        sordataBack.unshift({ price: 0, size: 0.0 });
                                    }
                                    avilBlack = sordataBack?.map((itemback) => {
                                        return (
                                            <td className="32047099_0availableToBack2_price_1171389306" onClick={() => props.placeBet(marketName,"Back", state.marketOdds[0].runners[index].ex.availableToBack[2].price, itemback, state.data.filter(newdata => { return newdata.selectionId === state.marketOdds[0].runners[index].selectionId })[0], state.marketOdds, index+state.TBindex, window.innerWidth, index)} >
                                                <span id="32047099_0availableToBack2_price_1171389306">{itemback.price}</span>
                                                <span id="32047099_0availableToBack2_size_1171389306">{itemback.size}</span>
                                            </td>
                                        )
                                    })

                                    let sordataLay = state.marketOdds[0]?.runners[index]?.ex?.availableToLay.sort(function (a, b) {
                                        if(marketName==="Bookmaker"){
                                            return b.price - a.price;
                                        }else{
                                            return a.price - b.price;
                                        }
                                    })

                                    if (sordataLay?.length < 3) {
                                        sordataLay.push({ price: 0, size: 0.0 });
                                    }

                                    availLay = sordataLay?.map((itemlay) => {
                                        return (
                                            <td className="32047099_0availableToBack2_price_1171389306" onClick={() => props.placeBet(marketName,"Lay", state.marketOdds[0].runners[index].ex.availableToLay[0].price, itemlay, state.data.filter(newdata => { return newdata.selectionId === state.marketOdds[0].runners[index].selectionId })[0], state.marketOdds, index+state.TBindex, window.innerWidth, index)} >
                                                <span id="32047099_0availableToBack2_price_1171389306">{itemlay.price}</span>
                                                <span id="32047099_0availableToBack2_size_1171389306">{itemlay.size}</span>
                                            </td>
                                        )
                                    })
                                }
                                else {
                                    avilBlack = state.avilBlack?.map((itemback) => {
                                        return (
                                            <td className="32047099_0availableToBack2_price_1171389306" onClick={() => props.placeBet(marketName,"Back", state.marketOdds[0].runners[index].ex.availableToBack[2].price, itemback, state.data.filter(newdata => { return newdata.selectionId === state.marketOdds[0].runners[index].selectionId })[0], state.marketOdds, index+state.TBindex, window.innerWidth, index)} >
                                                <span id="32047099_0availableToBack2_price_1171389306">{itemback.price}</span>
                                                <span id="32047099_0availableToBack2_size_1171389306">{itemback.size}</span>
                                            </td>
                                        )
                                    })
                                    availLay = state.availLay?.map((itemlay) => {
                                        return (
                                            <td className="32047099_0availableToBack2_price_1171389306" onClick={() => props.placeBet(marketName,"Lay", state.marketOdds[0].runners[index].ex.availableToLay[0].price, itemlay, state.data.filter(newdata => { return newdata.selectionId === state.marketOdds[0].runners[index].selectionId })[0], state.marketOdds, index+state.TBindex, window.innerWidth, index)} >
                                                <span id="32047099_0availableToBack2_price_1171389306">{itemlay.price}</span>
                                                <span id="32047099_0availableToBack2_size_1171389306">{itemlay.size}</span>
                                            </td>
                                        )
                                    })
                                }
                                // if(item.selectionId==state.marketOdds[0].runners[index].selectionId){}
                                if (filterrunners?.length > 0) {
                                    let Mindex = state.Mteams?.findIndex(x => x.marketName === marketName);
                                    return (
                                    <>
                                    {
                                    state.marketOdds[0].runners[index]?.status==='SUSPENDED'?
                                        <tr id="user_row0" className="back_lay_color runner-row-32047099">
                                        <td>
                                            <p className="runner_text" id="runnderName0">{filterrunners[0]?.runnerName}</p>
                                            <p className="blue-odds" id={"profit" + filterrunners[0]?.selectionId}></p>
                                            <span className="runner_amount" style={{ color: "black" }} id={"loss" + filterrunners[0]?.selectionId}>0{/* {expoProfit} */}</span>
                                            {
                                                <p className="blue-odds" id={"profit" + filterrunners[0]?.selectionId}>
                                                    {
                                                        showHide ? (state.data.length == 3 ? index === 0 ?
                                                        <span class={"runner_amount " + state.Mteams[Mindex]?.ToneColor}>{state.Mteams[Mindex]?.TonePL}</span> : index == 1 ?
                                                        <span class={"runner_amount " + state.Mteams[Mindex]?.TtwoColor}>{state.Mteams[Mindex]?.TtwoPL}</span> :
                                                        <span class={"runner_amount " + state.Mteams[Mindex]?.TthreeColor}>{state.Mteams[Mindex]?.TthreePL}</span> : index == 0 ?
                                                        <span class={"runner_amount " + state.Mteams[Mindex]?.ToneColor}>{state.Mteams[Mindex]?.TonePL}</span> :
                                                        <span class={"runner_amount " + state.Mteams[Mindex]?.TtwoColor}>{state.Mteams[Mindex]?.TtwoPL}</span>) : 
                                                        (state.data.length == 3 ? index === 0 ?
                                                            <span class={"runner_amount " + state.DMteams[Mindex]?.ToneColor}>{state.DMteams[Mindex]?.TonePL}</span> : index == 1 ?
                                                            <span class={"runner_amount " + state.DMteams[Mindex]?.TtwoColor}>{state.DMteams[Mindex]?.TtwoPL}</span> :
                                                            <span class={"runner_amount " + state.DMteams[Mindex]?.TthreeColor}>{state.DMteams[Mindex]?.TthreePL}</span> : index == 0 ?
                                                            <span class={"runner_amount " + state.DMteams[Mindex]?.ToneColor}>{state.DMteams[Mindex]?.TonePL}</span> :
                                                            <span class={"runner_amount " + state.DMteams[Mindex]?.TtwoColor}>{state.DMteams[Mindex]?.TtwoPL}</span>)
                                                    }
                                                </p>
                                            }
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td colSpan="2"><div style={{ width: "100%",background: "#95335c",margin: "-3px 0px -3px 0px",padding: "18px 0px",color: "white",fontWeight: "bold" }}>SUSPENDED</div></td>
                                        </tr>
                                        :<tr id="user_row0" className="back_lay_color runner-row-32047099">
                                                <td>
                                                    <p className="runner_text" id="runnderName0">{filterrunners[0]?.runnerName}</p>
                                                    <p className="blue-odds" id={"profit" + filterrunners[0]?.selectionId}></p>
                                                    <span className="runner_amount" style={{ color: "black" }} id={"loss" + filterrunners[0]?.selectionId}>0{/* {expoProfit} */}</span>
                                                    {
                                                        <p className="blue-odds" id={"profit" + filterrunners[0]?.selectionId}>
                                                            {
                                                                showHide ? (state.data.length == 3 ? index === 0 ?
                                                                <span class={"runner_amount " + state.Mteams[Mindex]?.ToneColor}>{state.Mteams[Mindex]?.TonePL}</span> : index == 1 ?
                                                                <span class={"runner_amount " + state.Mteams[Mindex]?.TtwoColor}>{state.Mteams[Mindex]?.TtwoPL}</span> :
                                                                <span class={"runner_amount " + state.Mteams[Mindex]?.TthreeColor}>{state.Mteams[Mindex]?.TthreePL}</span> : index == 0 ?
                                                                <span class={"runner_amount " + state.Mteams[Mindex]?.ToneColor}>{state.Mteams[Mindex]?.TonePL}</span> :
                                                                <span class={"runner_amount " + state.Mteams[Mindex]?.TtwoColor}>{state.Mteams[Mindex]?.TtwoPL}</span>) : 
                                                                (state.data.length == 3 ? index === 0 ?
                                                                    <span class={"runner_amount " + state.DMteams[Mindex]?.ToneColor}>{state.DMteams[Mindex]?.TonePL}</span> : index == 1 ?
                                                                    <span class={"runner_amount " + state.DMteams[Mindex]?.TtwoColor}>{state.DMteams[Mindex]?.TtwoPL}</span> :
                                                                    <span class={"runner_amount " + state.DMteams[Mindex]?.TthreeColor}>{state.DMteams[Mindex]?.TthreePL}</span> : index == 0 ?
                                                                    <span class={"runner_amount " + state.DMteams[Mindex]?.ToneColor}>{state.DMteams[Mindex]?.TonePL}</span> :
                                                                    <span class={"runner_amount " + state.DMteams[Mindex]?.TtwoColor}>{state.DMteams[Mindex]?.TtwoPL}</span>)
                                                            }
                                                        </p>
                                                    }
                                                    <input type="hidden" className="position_1171389306" id="selection_0" data-id={32047099} defaultValue={0} />
                                                </td>
                                                {avilBlack}
                                                {availLay}
                                            </tr>
                                            }
                                            <tr>
                                                <td colSpan="7">
                                                    <div className="mobileBetBox">
                                                        <BetBox
                                                            eventType={state.sportType}
                                                            matchName={state.matchName}
                                                            index={index+state.TBindex}
                                                            stake={0}
                                                            betData={state.betData}
                                                            betProfit={state.betProfit}
                                                            handleRemove={(style, num) => {
                                                                props.handleRemove(style, num, index+state.TBindex);
                                                            }}
                                                            disabledbox={(isdisabled) => {
                                                                props.disabledbox(index+state.TBindex,isdisabled);
                                                            }}
                                                            handleBetPlaceBox={(notfyMsg, bgColor, notfyStatus) => {
                                                                props.handleBetPlaceBox(notfyMsg, bgColor, notfyStatus);
                                                            }}
                                                            getProfitandLoss={(profit, loss, teamSelection, betType, stack, status, facFrom, marketName) => {
                                                                props.getProfitandLoss(profit, loss, teamSelection, betType, stack, status, facFrom, marketName);
                                                            }}
                                                            betLoss={state.betLoss}
                                                            setdisplay={state.display[index+state.TBindex]}
                                                            eventId={props?.eventId}
                                                            handleInput={(e) => props.handleInputValue(e)}
                                                            runnderData={state.data}
                                                            expoData={state.exporunnerdata}
                                                            selOdds={state.selOdds}
                                                            selfancyOdds={state.selfancyOdds}
                                                            selfancySize={state.selfancySize}
                                                            IP={state.IP}
                                                            sportInfo={state.sportInfo}
                                                            fancyInfo={state.fancyInfo}
                                                            expoBetProfit={state.expoBetProfit}
                                                            expoBetLoss={state.expoBetLoss}
                                                            betboxtime={8000}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </>
                                    )
                                }else{
                                    return (
                                        <>
                                        {
                                        index===1?
                                        <tbody>
                                        <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                            <td>
                                                <p class="runner_text" id="runnderName0">{state.matchName.split(" v ")[0]}</p>
                                                <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                                <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                            </td>
                                            <td colSpan="6"><div style={{ width: "100%",background: "#95335c",margin: "-3px 0px -3px 0px",padding: "15px 0px",color: "white",fontWeight: "bold" }}>SUSPENDED</div></td>
                                        </tr>
                                        <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                            <td>
                                                <p class="runner_text" id="runnderName0">{state.matchName.split(" v ")[1]}</p>
                                                <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                                <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                            </td>
                                            <td colSpan="6"><div style={{ width: "100%",background: "#95335c",margin: "-3px 0px -3px 0px",padding: "15px 0px",color: "white",fontWeight: "bold" }}>SUSPENDED</div></td>
                                        </tr>
                                        </tbody>:null}
                                        </>
                                    )
                                }
                            })
                            :
                            filterrunners.length === 0 && inPlay === "IN-PLAY" ?
                                state.oddsload ?
                                    <tbody>
                                        <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                            <td>
                                                <p class="runner_text" id="runnderName0">{state.matchName.split(" v ")[0]}</p>
                                                <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                                <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                            </td>
                                            {
                                                state.tableTd?.map((item) => {
                                                    return (
                                                        <td class="32047099_0availableToBack2_price_1171389306">
                                                            <span id="32047099_0availableToBack2_price_1171389306">{item}</span>
                                                            <span id="32047099_0availableToBack2_size_1171389306">{item}</span>
                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                        <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                            <td>
                                                <p class="runner_text" id="runnderName0">{state.matchName.split(" v ")[1]}</p>
                                                <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                                <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                            </td>
                                            {
                                                state.tableTd?.map((item) => {
                                                    return (
                                                        <td class="32047099_0availableToBack2_price_1171389306">
                                                            <span id="32047099_0availableToBack2_price_1171389306">{item}</span>
                                                            <span id="32047099_0availableToBack2_size_1171389306">{item}</span>
                                                        </td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    </tbody>
                                    :
                                    <tbody>
                                        <tr>
                                            <td colSpan="7" className="text-center"><h2>CLOSED</h2></td>
                                        </tr>
                                    </tbody>
                                :
                                <tbody>
                                    <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                        <td>
                                            <p class="runner_text" id="runnderName0">{state.matchName.split(" v ")[0]}</p>
                                            <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                            <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                        </td>
                                        {
                                            state.tableTd?.map((item) => {
                                                return (
                                                    <td class="32047099_0availableToBack2_price_1171389306">
                                                        <span id="32047099_0availableToBack2_price_1171389306">{item}</span>
                                                        <span id="32047099_0availableToBack2_size_1171389306">{item}</span>
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                    <tr id="user_row0" class="back_lay_color runner-row-32047099">
                                        <td>
                                            <p class="runner_text" id="runnderName0">{state.matchName.split(" v ")[1]}</p>
                                            <p class="blue-odds" id="Val1-117138930632047099">0</p>
                                            <span class="runner_amount" id="32047099_maxprofit_loss_runner_1171389306" >0</span>
                                        </td>
                                        {
                                            state.tableTd?.map((item) => {
                                                return (
                                                    <td class="32047099_0availableToBack2_price_1171389306">
                                                        <span id="32047099_0availableToBack2_price_1171389306">{item}</span>
                                                        <span id="32047099_0availableToBack2_size_1171389306">{item}</span>
                                                    </td>
                                                )
                                            })
                                        }
                                    </tr>
                                </tbody>
                    }
                </table>
            </div>
        </div>
    </div>)
}
export default React.memo(MatchOddsTable)