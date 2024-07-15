import React, { useEffect, useState } from 'react'
import { Row, Col } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Card from '../../../components/Card'
import '../../../services/config'
import { fetchData } from '../../../services/mix'
import globalConfig from '../../../services/config'
import './pagination.css'
import { confirmDelete } from '../../../services/alerts'

const BoatList = () => {
   const [boatlist, setBoatlist] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [query, setQuery] = useState('')
   const refresh = (page) => {
      const params = new URLSearchParams();
      if (query !== '')
         params.set('query', query);
      params.set('page', page)
      fetchData(`${globalConfig.BACKEND_URL}/api/boats/find-all?${params.toString()}`)
         .then(response => setBoatlist(response.docs))
   }

   const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
   }
   useEffect(() => {
      refresh(currentPage)
   }, [currentPage]);
   useEffect(() => {
      refresh(1)
   }, [query]);
   return (
      <>
         <div>
            <Row>
               <Col sm="12">
                  <Card>
                     <Card.Header className="d-flex justify-content-between">
                        <div className="header-title">
                           <h4 className="card-title">Boat List</h4>
                        </div>
                        <div>
                           <div className="input-group search-input me-2 mt-lg-0 mt-md-0 mt-3">
                              <span className="input-group-text" id="search-input">
                                 <svg width="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="11.7669" cy="11.7666" r="8.98856" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></circle>
                                    <path d="M18.0186 18.4851L21.5426 22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                 </svg>
                              </span>
                              <input type="search" className="form-control" placeholder="Search..." onChange={(event) => setQuery(event.target.value)} />
                           </div>
                        </div>

                     </Card.Header>
                     <Card.Body className="px-0">
                        <div className="table-responsive">
                           <table className="table table-striped" role="grid" data-toggle="data-table">
                              <thead>
                                 <tr className="ligth">
                                    {/* <th>Id</th> */}
                                    <th>Serial number</th>
                                    <th>Name</th>
                                    <th>Departure port</th>
                                    <th>Destination</th>
                                    <th>Number of passengers</th>
                                    <th>Action</th>
                                 </tr>
                              </thead>
                              <tbody>
                                 {
                                    boatlist.map((item, idx) => (
                                       <tr key={idx}>
                                          <td>{item.serialNumber}</td>
                                          <td>{item.name}</td>
                                          <td>{item.departurePort}</td>
                                          <td>{item.destination}</td>
                                          <td>{item.passengerNumber}</td>
                                          <td>
                                             <div className="flex align-items-center list-user-action">
                                                <Link onClick={async () => {
                                                   confirmDelete(`${globalConfig.BACKEND_URL}/api/boats/delete/${item._id}`, refresh)
                                                }} className="btn btn-sm btn-icon btn-danger" data-toggle="tooltip" data-placement="top" title="Delete" data-original-title="Delete" to="#">
                                                   <span className="btn-inner">
                                                      <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                                                         <path d="M19.3248 9.46826C19.3248 9.46826 18.7818 16.2033 18.4668 19.0403C18.3168 20.3953 17.4798 21.1893 16.1088 21.2143C13.4998 21.2613 10.8878 21.2643 8.27979 21.2093C6.96079 21.1823 6.13779 20.3783 5.99079 19.0473C5.67379 16.1853 5.13379 9.46826 5.13379 9.46826" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                         <path d="M20.708 6.23975H3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                         <path d="M17.4406 6.23973C16.6556 6.23973 15.9796 5.68473 15.8256 4.91573L15.5826 3.69973C15.4326 3.13873 14.9246 2.75073 14.3456 2.75073H10.1126C9.53358 2.75073 9.02558 3.13873 8.87558 3.69973L8.63258 4.91573C8.47858 5.68473 7.80258 6.23973 7.01758 6.23973" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                      </svg>
                                                   </span>
                                                </Link>{' '}
                                             </div>
                                          </td>
                                       </tr>))}
                              </tbody>
                           </table>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
            {/* Pagination controls */}
            <div className="pagination">
               <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                  Previous
               </button>
               <span className="current-page">{currentPage}</span>
               <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                  Next
               </button>
            </div>
         </div>
      </>
   )

}

export default BoatList;