import React, { useEffect, useState } from 'react'
import Card from '../../../components/Card'
import { Row, Col, Button, Modal, Form, Table, Dropdown, ButtonGroup, FormCheck } from 'react-bootstrap'
import { io } from 'socket.io-client'
import { MapContainer, Marker, TileLayer, useMap } from 'react-leaflet';
import '../../../../node_modules/leaflet/dist/leaflet.css'
import L from 'leaflet';
import icon from '../../../assets/images/vectormap/marker1.png';
// import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import globalConfig from '../../../services/config'
import axios from 'axios'
import './map-style.css'
import '../../../services/config';
import 'lazysizes';

function LocationMarkers({ refresh, markers, setMarkers }) {

    const [show, setShow] = useState(false);
    const [urgence, setUrgence] = useState({});

    const handleClose = () => setShow(false);
    const handleShow = async (latlng) => {
        refreshData(latlng)
        setShow(true)
    };

    const refreshData = async (latlng) => {
        if (latlng.hasOwnProperty("lat") && latlng.hasOwnProperty("lng")) {
            const response = await axios.get(`${globalConfig.BACKEND_URL}/api/urgences/find-urgence/${latlng.lat}/${latlng.lng}`)
            setUrgence(response.data)
        } else {
            const response = await axios.get(`${globalConfig.BACKEND_URL}/api/urgences/find-urgence/${latlng.longitude}/${latlng.latitude}`)
            setUrgence(response.data)
        }

    }
    const map = useMap()
    let DefaultIcon = L.icon({
        iconUrl: icon,
        // shadowUrl: iconShadow
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    useEffect(() => {
        const socket = io.connect(`${globalConfig.BACKEND_URL}`)
        socket.on('notification', (data) => {
            setMarkers((prevValue) => [...prevValue, [data.urgence.longitude, data.urgence.latitude]]);
            try {
                L.circle([data.urgence.longitude, data.urgence.latitude], { radius: 5000, color: "red" },).addTo(map);
            }
            catch (err) {
                console.log(err);
            }
            refresh()
        });

        socket.on('refresh', async (data) => {
            await refresh()
            await refreshData(data.data)
        });
        // eslint-disable-next-line
    }, [])

    return (
        <>
            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} aria-labelledby="contained-modal-title-vcenter" centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Urgence</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ display: "flex", justifyContent: 'space-evenly' }}>
                        <div>
                            <div style={{ backgroundColor: "lightgrey", width: "fit-content", padding: '10px' }}>
                                <h3>Latitude</h3>
                                {urgence.hasOwnProperty('longitude') &&
                                    <h5>{urgence.longitude}</h5>
                                }
                                <h3>Longitude</h3>
                                {urgence.hasOwnProperty('latitude') &&
                                    <h5>{urgence.latitude}</h5>
                                }
                            </div>
                            <div>

                            </div>
                            {urgence.hasOwnProperty('type') &&
                                <>
                                    <h5>Type of emergency</h5>
                                    <p>{urgence.type}</p>
                                </>
                            }
                            <h3> User : </h3>
                            {urgence.hasOwnProperty('user') &&
                                <>
                                    {urgence.user.hasOwnProperty('fullname') &&
                                        <>
                                            <h5>Fullname</h5>
                                            <p>{urgence.user.fullname}</p>
                                        </>
                                    }
                                    {urgence.user.hasOwnProperty('phone') &&
                                        <>
                                            <h5>Phone number</h5>
                                            <p>{urgence.user.phone}</p>
                                        </>
                                    }
                                    {urgence.user.hasOwnProperty('cin') &&
                                        <>
                                            <h5>Cin</h5>
                                            <p>{urgence.user.cin}</p>
                                        </>
                                    }
                                    {urgence.user.hasOwnProperty('passport') &&
                                        <>
                                            <h5>Passport</h5>
                                            <p>{urgence.user.passport}</p>
                                        </>
                                    }
                                    {urgence.user.hasOwnProperty('nationality') &&
                                        <>
                                            <h5>Nationality</h5>
                                            <p>{urgence.user.nationality}</p>
                                        </>
                                    }
                                </>
                            }

                        </div>
                        <div>
                            {urgence.hasOwnProperty('user') &&
                                <>
                                    {urgence.user.hasOwnProperty('boat') &&
                                        <>
                                            {urgence.user.boat.hasOwnProperty('serialNumber') &&
                                                <>
                                                    <h5>Serial Number</h5>
                                                    <p>{urgence.user.boat.serialNumber}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('name') &&
                                                <>
                                                    <h5>Name</h5>
                                                    <p>{urgence.user.boat.name}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('ownerName') &&
                                                <>
                                                    <h5>Owner Name</h5>
                                                    <p>{urgence.user.boat.ownerName}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('ownerCin') &&
                                                <>
                                                    <h5>Owner Cin</h5>
                                                    <p>{urgence.user.boat.ownerCin}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('ownerPassport') &&
                                                <>
                                                    <h5>Owner Passport</h5>
                                                    <p>{urgence.user.boat.ownerPassport}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('departurePort') &&
                                                <>
                                                    <h5>Departure Port</h5>
                                                    <p>{urgence.user.boat.departurePort}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('destination') &&
                                                <>
                                                    <h5>Destination</h5>
                                                    <p>{urgence.user.boat.destination}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('passengerNumber') &&
                                                <>
                                                    <h5>Passenger Number</h5>
                                                    <p>{urgence.user.boat.passengerNumber}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('departureDay') &&
                                                <>
                                                    <h5>Departure Day</h5>
                                                    <p>{urgence.user.boat.departureDay}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('pavillon') &&
                                                <>
                                                    <h5>Pavillon</h5>
                                                    <p>{urgence.user.boat.pavillon}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('userName') &&
                                                <>
                                                    <h5>User Name</h5>
                                                    <p>{urgence.user.boat.userName}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('nationality') &&
                                                <>
                                                    <h5>Nationality</h5>
                                                    <p>{urgence.user.boat.nationality}</p>
                                                </>
                                            }
                                            {urgence.user.boat.hasOwnProperty('userPassport') &&
                                                <>
                                                    <h5>User Passport</h5>
                                                    <p>{urgence.user.boat.userPassport}</p>
                                                </>
                                            }
                                        </>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer variant="secondary">
                    <Form.Group>
                        <Form.Control type="email" placeholder='Email' />
                    </Form.Group>
                    <Button variant="primary" onClick={() => { handleClose() }}>
                        Envoyer
                    </Button>{' '}
                    <Button variant="danger" onClick={handleClose}>
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>
            <React.Fragment>
                {markers &&
                    markers.map((marker, key) =>
                        <Marker key={key} position={marker} eventHandlers={{
                            click: (e) => {
                                handleShow(e.latlng)
                            },
                        }} ></Marker>)
                }
            </React.Fragment>
        </>

    );
}


const Google = () => {
    const types = ['All', 'Panne', 'Type1', 'Type2', 'Type3', 'Type4']
    const [urgences, setUrgences] = useState([]);
    const [selectedType, setSelectedType] = useState(null);
    const [enclosed, setEnclosed] = useState('All');
    const [markers, setMarkers] = useState([]);
    const refresh = () => {
        const params = new URLSearchParams();
        if (enclosed !== 'All')
            params.set('cloture', enclosed);
        if (selectedType && selectedType !== "All")
            params.set('type', selectedType);

        axios.get(`${globalConfig.BACKEND_URL}/api/urgences/find-all?${params.toString()}`)
            .then((response) => {
                setUrgences(response.data)
                setMarkers([])
                response.data.map(item => setMarkers((prevValue) => [...prevValue, [item.longitude, item.latitude]]))
            })
    }
    useEffect(() => {
        refresh();
        // eslint-disable-next-line
    }, [selectedType, enclosed]);
    return (
        <div>
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title">
                                <h4 className="card-title">Map</h4>
                            </div>
                        </Card.Header>
                        <Card.Body>
                            <MapContainer
                                center={[36.96021, 10.319944]}
                                zoom={5}
                                style={{ width: '100%', height: '520px' }}
                            >
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarkers refresh={refresh} markers={markers} setMarkers={setMarkers} />
                            </MapContainer>
                        </Card.Body>
                    </Card>
                </Col>
                <Col sm="12">
                    <Row>
                        <Col sm="8">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">SOS</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div className="bd-example table-responsive">
                                        <Table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Lng & lat</th>
                                                    <th scope="col">Type</th>
                                                    {/* <th scope="col">Level</th>
                                                    <th scope="col">Status</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {urgences.map((item, key) => (
                                                    <tr key={key}>
                                                        <th scope="row">{item.longitude}, {item.latitude}</th>
                                                        <td>{item.type}</td>
                                                        {/* <td>{item.niveau}</td>
                                                        <td>{item.status}</td> */}
                                                    </tr>
                                                ))
                                                }
                                            </tbody>
                                        </Table>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col sm="4">
                            <Card>
                                <Card.Header className="d-flex justify-content-between">
                                    <div className="header-title">
                                        <h4 className="card-title">Filters</h4>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    <div>
                                        <div className='row filter'>
                                            <div className='col-sm-4'>
                                                <label>Emergency Type : </label>
                                            </div>
                                            <div className='col-sm-8'>
                                                <Dropdown as={ButtonGroup} style={{ float: 'right' }}>
                                                    <Button type="button" variant="warning">
                                                        {selectedType === null ? 'Type' : selectedType}
                                                    </Button>
                                                    <Dropdown.Toggle as={Button} split type="button" variant="warning">
                                                        <span className="visually-hidden">Toggle Dropdown</span>
                                                    </Dropdown.Toggle>
                                                    <Dropdown.Menu>
                                                        {types.map((item, key) => (
                                                            <Dropdown.Item key={key} href="#" onClick={() => {
                                                                setSelectedType(item)
                                                            }}>{item}</Dropdown.Item>
                                                        ))}
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </div>
                                        </div>
                                        <div className='row filter'>
                                            <div className='col-sm-6'>
                                                <label>Enclose</label>
                                            </div>
                                            <div className="col-sm-5 form-check form-switch form-check-inline">
                                                <FormCheck.Input onChange={() => {
                                                    setEnclosed(!enclosed)
                                                }} type="checkbox" id="switch" />
                                                {enclosed === 'All' ? <label>All</label>
                                                    : enclosed === true ? <label>Enclosed</label> : <label>Not enclosed</label>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row >

        </div >
    )
}

// export default Google
export default React.memo(Google)

