import Modal from '@/Components/Modal';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { useEffect } from 'react';

export default function CreateEditModal({ show, onClose, menu = null }) {
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        name: '',
        price: '',
        duration: '',
        description: '',
        status: true,
    });

    useEffect(() => {
        if (menu) {
            setData({
                name: menu.name,
                price: menu.price,
                duration: menu.duration,
                description: menu.description || '',
                status: menu.status === 1 || menu.status === true,
            });
        } else {
            reset();
        }
        clearErrors();
    }, [menu, show]);

    const submit = (e) => {
        e.preventDefault();

        if (menu) {
            put(route('staff.menus.update', menu.id), {
                onSuccess: () => onClose(),
            });
        } else {
            post(route('staff.menus.store'), {
                onSuccess: () => onClose(),
            });
        }
    };

    return (
        <Modal show={show} onClose={onClose}>
            <form onSubmit={submit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900">
                    {menu ? 'メニュー編集' : '新規メニュー作成'}
                </h2>

                <div className="mt-6">
                    <InputLabel htmlFor="name" value="メニュー名" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                    />
                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-6 flex gap-4">
                    <div className="w-1/2">
                        <InputLabel htmlFor="price" value="料金 (円)" />
                        <TextInput
                            id="price"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            required
                        />
                        <InputError message={errors.price} className="mt-2" />
                    </div>
                    <div className="w-1/2">
                        <InputLabel htmlFor="duration" value="所要時間 (分)" />
                        <TextInput
                            id="duration"
                            type="number"
                            className="mt-1 block w-full"
                            value={data.duration}
                            onChange={(e) => setData('duration', e.target.value)}
                            required
                        />
                        <InputError message={errors.duration} className="mt-2" />
                    </div>
                </div>

                <div className="mt-6">
                    <InputLabel htmlFor="description" value="説明" />
                    <textarea
                        id="description"
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        rows="3"
                    />
                    <InputError message={errors.description} className="mt-2" />
                </div>

                <div className="mt-6 flex items-center">
                    <input
                        id="status"
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                        checked={data.status}
                        onChange={(e) => setData('status', e.target.checked)}
                    />
                    <label htmlFor="status" className="ml-2 block text-sm text-gray-900">
                        有効にする
                    </label>
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        キャンセル
                    </SecondaryButton>

                    <PrimaryButton className="ml-3" disabled={processing}>
                        {menu ? '更新' : '作成'}
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
