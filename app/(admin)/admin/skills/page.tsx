"use client"
import React, { useEffect, useState } from 'react';
import { ConfigProvider, Popconfirm, Popover, Select } from 'antd';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSession } from 'next-auth/react';
import { useAddNewSkill, useDeleteSkill, useEditSkill, useGetAllSkills } from '@/query/client/adminQueries';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';

const SkillsPage = () => {
    const { data: session }:any = useSession();
    const { data: allSkills, isLoading: loadingAllSkills } = useGetAllSkills(session?.user?.id);
    const { mutateAsync: addSkill, isPending: addingNewSkill } = useAddNewSkill();
    const { mutateAsync: editSkill, isPending: edittingSkill } = useEditSkill();
    const { mutateAsync: deleteSkill, isPending: deletingSkill } = useDeleteSkill();
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [newSkill, setNewSkill] = useState('');
    const [corrected, setCorrected] = useState('');

    useEffect(() => {
        if (allSkills) {
            setFilteredOptions(allSkills?.Skills?.filter((o: any) => !selectedItems.includes(o)));
        }
    }, [allSkills, selectedItems]);

    const handleCorrection = async (skill: string) => {
        try {
            const response = await editSkill({ adminId: session?.user?.id, skill: skill, correctedSkill: corrected });
            if (response?._id) {
                toast.success("Skill Updated Successfully.");
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setCorrected('');
        }
    };

    const addNewSkill = async () => {
        try {
            const response = await addSkill({ adminId: session?.user?.id, skill: newSkill });
            if (response?._id) {
                toast.success("New Skill Added.");
            } else if (response?.skillExist){
                toast.info("Skill Already Added!")
            } else {
                toast.error("Something went wrong.");
            }
        } catch (error) {
            console.log(error);
        } finally {
            setNewSkill('');
        }
    };

    const handleDeleteSkill = async (skill: string) => {
        try {
            const response = await deleteSkill({ adminId: session?.user?.id, skill: skill });
            if (response?._id) {
                toast.success("Skill Successfully Deleted.");
            } else {
                toast.error("Deletion failed.");
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className={`p-4 ${loadingAllSkills && 'blur-lg'}`}>
            <h1 className='text-xl font-bold mb-3'>Added Skills</h1>
            <div className="flex justify-between flex-wrap mb-3">
                <div className="w-full lg:w-6/12">
                    <ConfigProvider
                        theme={{
                            token: {
                                colorPrimary: '#00b96b',
                                colorBgContainer: '#f6ffed',
                                colorTextPlaceholder: 'gray'
                            },
                        }}
                    >
                        <Select 
                            mode="multiple" 
                            placeholder="Filter Out Skills" 
                            value={selectedItems} 
                            style={{ width: '100%' }}
                            onChange={setSelectedItems}
                            options={filteredOptions.map((item) => ({
                                value: item,
                                label: item,
                            }))}
                        />
                    </ConfigProvider>
                </div>
                <Popover 
                    content={
                        <div className='flex gap-1 items-center'>
                            <Input placeholder='Enter Skill to Add' value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
                            <Button variant='secondary' onClick={addNewSkill}>{addingNewSkill ? "Creating.." : 'Create.'}</Button>
                        </div>
                    } 
                    title="Add Skill" 
                    placement='bottom' 
                    trigger='click'
                >
                    <Button>{addingNewSkill ? 'Adding...' : 'Add New Skill'}</Button>
                </Popover>
            </div>
            <div className="flex flex-wrap">
                {(selectedItems.length === 0 ? allSkills?.Skills : selectedItems)?.map((skill: any) => (
                    <div className="w-full lg:w-3/12 p-1" key={skill}>
                        <div className="bg-cyan-950 border border-slate-700 flex gap-1 items-center justify-between p-2 rounded-sm">
                            <h1 className='text-sm font-medium'>{skill}</h1>
                            <div className='flex gap-1'>
                                <Popover 
                                    content={
                                        <div className='flex gap-1 items-center'>
                                            <Input placeholder='enter corrected skillname' value={corrected || skill} onChange={(e) => setCorrected(e.target.value)} />
                                            <Button variant='secondary' onClick={() => handleCorrection(skill)}>{edittingSkill ? 'Editting...' : 'Update'}</Button>
                                        </div>
                                    } 
                                    title="Edit Skill" 
                                    trigger="click"
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className='bg-slate-200 text-black p-1 rounded-sm cursor-pointer'>
                                        <Pencil size={18} />
                                    </motion.div>
                                </Popover>
                                <Popconfirm 
                                    title="Remove Skill" 
                                    description="Are you sure to remove this skill?" 
                                    onConfirm={() => handleDeleteSkill(skill)}
                                >
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className='bg-slate-200 text-red-700 p-1 rounded-sm cursor-pointer'>
                                        <Trash2 size={18} />
                                    </motion.div>
                                </Popconfirm>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SkillsPage;
