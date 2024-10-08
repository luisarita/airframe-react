import React, { useState, useEffect } from 'react'
import { Container, Row, Col, Button, Accordion, CardText } from '../../../components'
import DatePicker, { setDefaultLocale } from 'react-datepicker'
import { ButtonInput } from './components/ButtonInput'
import moment from 'moment'

import {
  TableData
} from './components'
import { HeaderMain } from '../../components/HeaderMain'
// import { data } from '../../../Apis/contabilidad_ventas_data.json'

setDefaultLocale('es')

export const ContabilidadVentas = () => {
  const [tableData, setTableData] = useState([])
  const [columNames, setColumNames] = useState([])
  const [columFields, setColumsFields] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState(moment().startOf('month').toDate())
  const [endDate, setEndDate] = useState(moment().startOf('month').toDate())

  const _handleChangeStart = (startDate) => (
    setStartDate(startDate)
  )

  const _handleChangeEnd = (endDate) => (
    setEndDate(endDate)
  )

  const handleAPICall = () => {
    setLoading(true)
    console.log(moment(startDate).format('YYYY-MM-DD'))
    fetchData(moment(startDate).format('YYYY-MM-DD'), moment(endDate).format('YYYY-MM-DD'))
  }

  const fetchData = async (startDate, endDate) => { // TODO: 1) pasar esto a una carpeta de conexion con apis para ser mas ordenado, 2) Migrar a axios
    try {
      const response = await fetch('http://127.0.0.1:5500/app/Apis/contabilidad_ventas_data.json') // esto esta corriendo en un servidor local
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const result = await response.json()
      console.log(result)
      if (result) {
        const { columnNames, columnFields, dataTable } = result

        setTableData(dataTable)
        setColumNames(columnNames)
        setColumsFields(columnFields)

        console.log(columnNames)
        console.log(columnFields)
        console.log('fetch', dataTable)
      } else {
        throw new Error('Network response was empty')
      }
      // setData(result)
    } catch (error) {
      console.log(error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container className="mx-0">
      <HeaderMain
        title="Contabilidad - Ventas"
        className="mb-5 mt-2"
      />
          <div style={{ position: 'relative', display: 'inline-block' }}>
          <DatePicker
            customInput={<ButtonInput />}
            selected={startDate}
            onChange={_handleChangeStart}
          />
          </div>
          <div style={{ position: 'relative', display: 'inline-block' }}>
          <DatePicker
        customInput={<ButtonInput />}
        selected={endDate}
        onChange={_handleChangeEnd}
      />
        </div>

      <Button style={{ marginLeft: 5 }} color="primary" onClick={() => handleAPICall()}><i className="fa fa-search mr-2"></i>Buscar</Button>
      {
        loading // hasta que esta cargado y todos los elementos tiene datos mostramos el componente
          ? <div style={{ marginTop: 20 }}>
            <i className="fa fa-spinner fa-spin" style={{ fontSize: '2em', color: '#1EB7FF', marginRight: '8px' }}></i>
            Por Favor Espera. Cargando...
          </div>
          : error
            ? <div style={{ marginTop: 20 }}>
              <Accordion className="mb-2 bg-danger text-white" initialOpen>
              <Accordion.Header className="text-white">
              Oh snap! You got an error!
              </Accordion.Header>
              <Accordion.Body>
                <CardText>No se puedieron cargar los datos {error}</CardText>
              </Accordion.Body>
            </Accordion>
          </div>
            : (tableData.length > 0 && columNames.length > 0 && columFields.length > 0) && <Row className="mb-5">
            <Col>
              <TableData tableData={tableData} columNames={columNames} columFields={columFields} />
            </Col>
          </Row>
      }
    </Container>
  )
}
