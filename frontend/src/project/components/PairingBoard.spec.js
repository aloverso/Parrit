import React from 'react'
import { shallow } from 'enzyme'

import PairingBoard from './PairingBoard.js'
import PersonList from './PersonList'

describe('<PairingBoard/>', () => {
    let wrapper, props
    const InnerPairingBoard = PairingBoard.DecoratedComponent.WrappedComponent

    beforeEach(() => {
        props  = {
            id: 77,
            name: 'PairingBoard1',
            people: [
                { name: 'George' },
                { name: 'Hank Muchacho' }
            ],
            roles: [
                { name: 'Interrupt' }
            ],
            exempt: false,
            editMode: false,
            editErrorMessage: 'some error message',
            isOver: false,
            renamePairingBoard: jasmine.createSpy('renamePairingBoardSpy'),
            deletePairingBoard: jasmine.createSpy('deletePairingBoardSpy'),
            moveRole: jasmine.createSpy('moveRoleSpy'),
            deleteRole: jasmine.createSpy('deleteRoleSpy'),
            setNewRoleModalOpen: jasmine.createSpy('setNewRoleModalOpen'),
            setPairingBoardEditMode: jasmine.createSpy('setPairingBoardEditModeSpy'),
            connectDropTarget: jasmine.createSpy('connectDropTargetSpy')
        }

        props.connectDropTarget.and.callFake(i => i)

        wrapper = shallow(<InnerPairingBoard {...props} />)
    })

    it('renders the pairing board with only the pairing board class', () => {
        expect(wrapper.prop('className')).toBe('pairing-board')
    })

    it('renders the pairing board header', () => {
        const pairingBoardHeader = wrapper.find('PairingBoardHeader')
        expect(pairingBoardHeader.prop('name')).toBe('PairingBoard1')
        expect(pairingBoardHeader.prop('exempt')).toBe(false)
        expect(pairingBoardHeader.prop('editMode')).toBe(false)
        expect(pairingBoardHeader.prop('editErrorMessage')).toBe('some error message')
    })

    it('passes the header a rename function that calls renamePairingBoard with a callback that sets editMode to false', () => {
        const passedRenameFunction = wrapper.find('PairingBoardHeader').prop('renamePairingBoard')
        passedRenameFunction('SomeNewName')

        expect(props.renamePairingBoard).toHaveBeenCalledWith(77, 'SomeNewName', jasmine.anything())

        const successCallback = props.renamePairingBoard.calls.mostRecent().args[2]
        successCallback()

        expect(props.setPairingBoardEditMode).toHaveBeenCalledWith(77, false)
    })

    it('passes the header a delete function that calls deletePairingBoard', () => {
        const passedDeleteFunction = wrapper.find('PairingBoardHeader').prop('deletePairingBoard')
        passedDeleteFunction()

        expect(props.deletePairingBoard).toHaveBeenCalledWith(77)
    })

    it('passes the header a enable edit mode function that sets editMode to true', () => {
        const passedEnableEditModeFunction = wrapper.find('PairingBoardHeader').prop('enableEditMode')
        passedEnableEditModeFunction()

        expect(props.setPairingBoardEditMode).toHaveBeenCalledWith(77, true)
    })

    it('passes the header a open new role modal function that calls setNewRoleModalOpen', () => {
        const passedOpenNewRoleModalFunction = wrapper.find('PairingBoardHeader').prop('openNewRoleModal')
        passedOpenNewRoleModalFunction()

        expect(props.setNewRoleModalOpen).toHaveBeenCalledWith(77, true)
    })

    it('renders the list of roles with curried methods', () => {
        const roles = wrapper.find('RoleList')
        expect(roles.prop('roles')).toBe(props.roles)

        roles.prop('moveRole')(123, { pairingBoardId: 444 })
        expect(props.moveRole).toHaveBeenCalledWith(77, 123, { pairingBoardId: 444 })

        roles.prop('deleteRole')(123)
        expect(props.deleteRole).toHaveBeenCalledWith(77, 123)
    })

    it('renders the list of people', () => {
        const people = wrapper.find(PersonList)
        expect(people.prop('people')).toBe(props.people)
    })

    it('adds the editing class when editMode is true', () => {
        props.editMode = true
        wrapper = shallow(<InnerPairingBoard {...props} />)
        expect(wrapper.prop('className')).toContain('editing')
    })

    it('adds the exempt class when exempt is true', () => {
        props.exempt = true
        wrapper = shallow(<InnerPairingBoard {...props} />)
        expect(wrapper.prop('className')).toContain('exempt')
    })

    it('adds the drop-target class when isOver is true', () => {
        props.isOver = true
        wrapper = shallow(<InnerPairingBoard {...props} />)
        expect(wrapper.prop('className')).toContain('drop-target')
    })
})