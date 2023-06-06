export * from './hooks';
export * from './layouts';
export * from './ToastCustom';
export * from './withAuth';

type Merge = (listClass: Array<string | undefined>) => string;
export const merge: Merge = (listClass) => {
	return listClass.filter((ele) => !!ele).join(' ');
};
