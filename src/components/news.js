import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import Navbar from './Navbar'
import Users from '../Services/users';

export default class news extends Component{
    constructor(props){
        super(props);
        this.state = {
            news:'',
            updatedNews:'',
            editabletext:'',
            active:'',
            newsId:'',
            newsTitle:'',
            NewsList:[],
            newsBox:{
                width:"90%",
                marginTop:'13rem',
                marginLeft:'5%'
            },
            newsHead:{
                backgroundColor:'#95335c',
                color:'white',
                padding:'7px 0 7px 0',
            }
        } 
        this.users = new Users();
    }

    // getNews = async () => {
    //     await this.users.getActiveNews(data=>{
    //         if(data.data.data.length>=1){
    //             this.setState({
    //                 news:data.data.data[0].newsTitle
    //             })
    //         }
    //         else{
    //             this.setState({
    //                 news:''
    //             })
    //         }
    //     })
    //   }

    componentDidMount = async() => {
        await this.getNewsData();
        // this.getNews();
    }

    getNewsData = () => {
        this.users.getNews((data) => {
            this.setState({
                NewsList:data.data.data
            })
        })
    }

    handleAddNews = () => {
        if(this.state.newsTitle!==""){
            this.users.addNews(this.state.newsTitle,(data)=>{
                this.getNewsData();
                this.setState({
                    NewsList:data.data.data
                })
            })
        }
    }

    handleDelete = (id) => {
        const obj = {
            id:id
        }
        this.users.deleteNews(obj,(data)=>{
            // console.log("DELETE",data);
        })
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name]:event.target.value
        })
    }

    handleNewsActive = async (id,status) => {
        if(id !== "" && status!==true){
            const obj = {
                id:id
            }
            this.users.activeInactiveNews(id,obj,data => {
                document.getElementById('news').click();
                this.getNewsData();
                // this.getNews();
                switch ('success') {
                    case 'success':
                        toast.success('News Activated Successfully !',{
                            position:"bottom-right",
                            hideProgressBar:true
                          });
                        // NotificationManager.success(,"Success");
                        break;
                }
            })
            // window.location.reload();
        }
    }

    handleNewsTitle = (id,title) => {
        this.setState({
            editabletext:id,
            updatedNews:title
        })
    }
    
    handleUpdateNewsTitle = (id) => {
        if(id !== "" || this.state.updatedNews !== ""){
            const obj = {
                id: id,
                newsTitle:this.state.updatedNews
            }
            this.users.updateNews(obj,data=>{
                this.getNewsData();
                switch ('success') {
                    case 'success':
                        toast.success("News Updated Successfully !",{
                            position:"bottom-right",
                            hideProgressBar: true,
                          });
                        // NotificationManager.success('',"Success");
                        break;
                }
            })
        }
        this.setState({
            editabletext:''
        })
    }

    render(){
        return(
            <div>
                <Navbar news={this.state.newsControl} />
                <ToastContainer/>
                <div style={this.state.newsBox}>
                    <div style={this.state.newsHead}>
                        <h1 className="text-center"> News List</h1>
                    </div>
                    <div>
                        <form style={{margin:'3rem 0 1rem 0', display:"flex"}} >
                            {/* <input type='text' name="newsId" className="form-control" style={{width:"25%",marginRight:'1rem'}} placeholder="News ID"/> */}
                            <input type='text' name="newsTitle" onChange={this.handleChange} autoComplete="off" className="form-control" style={{marginRight:'1rem'}}  placeholder="Add News"/>
                            <input type="button" value="Add News" onClick={this.handleAddNews} style={{backgroundColor:'#95335c', outline:'none',color:'white', borderRadius:'5px'}} />
                        </form>
                    </div>
                    <div style={{width:'100%', border:'1px solid #ddaed9', margin:'2rem 0 1rem 0'}}></div>
                    <div className="text-center" style={{float:'right', margin:'0 0 1rem 0',fontSize:'15px',width:'100%'}}>Total Records : {this.state.NewsList.length}</div>
                    <div style={{margin:'3rem'}}>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr style={{backgroundColor:'#6c1945',color:'white'}}>
                                    <th className="text-center" style={{width:'10%'}}>ID</th>
                                    <th className="text-center" style={{width:'10%'}}>Delete</th>
                                    <th className="text-center" style={{width:'70%'}}>Tittle</th>
                                    <th className="text-center" style={{width:'10%'}}>Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.NewsList.length > 0 ?
                                    this.state.NewsList.map((element,index) =>
                                    <tr key={element._id}>
                                        <td className="text-center">{index+1}</td>
                                        <td className="text-center" >
                                            <input type="button" value="Delete" onClick={(_id)=>this.handleDelete(element._id)} style={{backgroundColor:'#95335c', outline:'none',color:'white', borderRadius:'3px'}} />
                                        </td>
                                        {   this.state.editabletext !== element._id ?
                                            <td style={{cursor:'pointer'}} onClick={()=>this.handleNewsTitle(element._id,element.newsTitle)}>{element.newsTitle}</td> :
                                            <td style={{display:'flex'}}>
                                                <input type="text" className="form-control" name="updatedNews" value={this.state.updatedNews} onChange={this.handleChange} />
                                                <input type="button" value="Update" onClick={()=>this.handleUpdateNewsTitle(element._id)} style={{backgroundColor:'#95335c', outline:'none',color:'white', borderRadius:'3px'}} />
                                            </td> 
                                        }
                                        <td className="text-center" >
                                            <input type="radio" name="active" onChange={()=>this.handleNewsActive(element._id,element.active)} checked={element.active && "checked"} />
                                        </td>
                                    </tr>
                                ):
                                    <tr>
                                        <td className="text-center" colSpan={4}>Empty...!</td>
                                    </tr>
                                }   
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}