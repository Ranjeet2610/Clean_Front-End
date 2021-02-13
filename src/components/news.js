import React, { Component } from 'react';
import Navbar from './Navbar'
import Users from '../Services/users';

export default class news extends Component{
    constructor(props){
        super(props);
        this.state = {
            newsId:'',
            newsTitle:'',
            NewsList:[],
            newsBox:{
                width:"90%",
                marginTop:'15rem',
                marginLeft:'5%'
            },
            newsHead:{
                backgroundColor:'#95335c',
                color:'white',
                padding:'1rem 0 1rem 0',
            }
        } 
        this.users = new Users();
    }

    componentDidMount = () => {
        this.users.getNews((data) => {
            this.setState({
                NewsList:data.data.data
            })
        })
    }

    handleSubmit = (e) => {
        // e.preventDefault();
        // if(methodType==='post'){
        //     console.log("waala",data.data.data);
        // } 
        // else if(methodType==='delete'){
        //     this.setState({
        //         NewsList:data.data.data
        //     })
        // } 
        // else{
        //     this.setState({
        //         NewsList:data.data.data
        //     })
        // }
      }

      handleDelete = (id) => {
          debugger
        this.users.deleteNews(id,(data)=>{
            console.log("DELETE",data);
        })
      }

    render(){
        return(
            <div>
                <Navbar/>
                <div style={this.state.newsBox}>
                    <div style={this.state.newsHead}>
                        <h1 className="text-center"> News List</h1>
                    </div>
                    <div>
                        <form style={{margin:'3rem', display:"flex"}} >
                            <input type='text' name="newsId" className="form-control" style={{width:"25%",marginRight:'1rem'}} placeholder="News ID"/>
                            <input type='text' name="newsTitle" className="form-control" style={{marginRight:'1rem'}}  placeholder="News Title"/>
                            <input type="button" value="Add News" onClick={(e)=>this.handleSubmit(e)} style={{backgroundColor:'#95335c', outline:'none',color:'white', borderRadius:'5px'}} />
                        </form>
                    </div><hr/>
                    <div style={{float:'right', margin:'0 3rem 3rem 0',fontSize:'15px'}}>Total Records : {this.state.NewsList.length}</div>
                    <div style={{margin:'3rem'}}>
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr style={{backgroundColor:'#6c1945',color:'white'}}>
                                    <th className="text-center">Delete</th>
                                    <th className="text-center">ID</th>
                                    <th className="text-center">Tittle</th>
                                    <th className="text-center">Active</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.NewsList.length > 0 ?
                                    this.state.NewsList.map((element) =>
                                    <tr>
                                        <td className="text-center" style={{width:'10%'}}>
                                            <input type="button" value="Delete" onClick={()=>this.handleDelete(element._id)} style={{backgroundColor:'#95335c', outline:'none',color:'white', borderRadius:'3px'}} />
                                        </td>
                                        <td className="text-center" style={{width:'15%'}}>{element.newsID}</td>
                                        <td className="text-center">{element.newsTitle}</td>
                                        <td className="text-center" style={{width:'10%'}}>{element.active ? 'true' : 'false'}</td>
                                    </tr>
                                ):null}   
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        )
    }
}