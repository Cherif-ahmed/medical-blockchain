const { assert } = require("chai")

const Auth = artifacts.require('./Auth.sol')

contract('Auth', (accounts) => {
    before(async () => {
        this.Auth = await Auth.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.Auth.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('initializes successfully', async () => {
        const patientCount = await this.Auth.patientCount()
        const doctorCount = await this.Auth.doctorCount()
        const AdminCount = await this.Auth.AdminCount()
        assert.equal(patientCount, 0)
        assert.equal(doctorCount, 0)
        assert.equal(AdminCount, 0)

    })
    
    it('registers patient', async () => {
        const result = await this.Auth.registerPatient(accounts[2], 'FirstName', 'LastName', 'example@email.com', '0544886677', '01/01/1986', 'HOMEaddress', 'Male')
        const patientCount = await this.Auth.patientCount()
        const isRegistered = await this.Auth.checkRegister(accounts[2])
        assert.equal(isRegistered, true)
        assert.equal(patientCount, 1)
        const event = result.logs[0].args
        assert.equal(event.email, 'example@email.com')
        assert.equal(event.addr, accounts[2])
    })

    it('registers admin', async () => {
        const result = await this.Auth.registerAdmin(accounts[2], 'FirstName', 'LastName', 'example@email.com', '0544886677', '01/01/1986', 'Male')
        const AdminCount = await this.Auth.AdminCount()
        const isRegistered = await this.Auth.checkRegister(accounts[2])
        const isAdmin = await this.Auth.isAdmin(accounts[2])
        assert.equal(isAdmin, true)
        assert.equal(isRegistered, true)
        assert.equal(AdminCount, 1)
        const event = result.logs[0].args
        assert.equal(event.email, 'example@email.com')
        assert.equal(event.addr, accounts[2])
    })

    it('registers health worker', async () => {
        const result = await this.Auth.registerDoctor(accounts[2], 'FirstName', 'LastName','Spectialit','Institu', 'example@email.com', '0544886677', '01/01/1986', 'workAddress', 'Male')
        const doctorCount = await this.Auth.doctorCount()
        const isRegistered = await this.Auth.checkRegister(accounts[2])
        const isHealthWorker = await this.Auth.isDoctor(accounts[2])
        assert.equal(isHealthWorker, true)
        assert.equal(isRegistered, true)
        assert.equal(doctorCount, 1)
        const event = result.logs[0].args
        assert.equal(event.email, 'example@email.com')
        assert.equal(event.addr, accounts[2])
    })

    it('adds document', async () => {
        const doctor = await this.Auth.registerDoctor(accounts[2], 'FirstName', 'LastName','Spectialit','Institu', 'example@email.com', '0544886677', '01/01/1986', 'workAddress', 'Male')
        const patient = await this.Auth.registerPatient(accounts[3], 'FirstName', 'LastName', 'example@email.com', '0544886677', '01/01/1986', 'HOMEaddress', 'Male')
        result = await this.Auth.Add_document(accounts[3], 'docType', 'docLink', 'docDecsr', '02/02/2022',{from:accounts[2]})
        const patientInfo = await this.Auth.patients(accounts[3])
        const event = result.logs[0].args
        const document = await this.Auth.documents(event.document_id.toNumber())
        assert.equal(event.doctor_addr, accounts[2])
        assert.equal(event.patient_addr, accounts[3])
        assert.equal(patientInfo.patient_docCount-1, event.document_id.toNumber())
        assert.equal(document.document_id, event.document_id.toNumber())
    })
})