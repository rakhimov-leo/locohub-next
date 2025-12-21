import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { NextPage } from 'next';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import PropertyCard from '../../libs/components/property/PropertyCard';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/property/Filter';
import { useRouter } from 'next/router';
import { PropertiesInquiry } from '../../libs/types/property/property.input';
import { Property } from '../../libs/types/property/property';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Direction, Message } from '../../libs/enums/common.enum';
import { GET_PROPERTIES } from '../../apollo/user/query';
import { useQuery, useMutation } from '@apollo/client';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { T } from '../../libs/types/common';
import AnimatedSection from '../../libs/components/common/AnimatedSection';
import AnimatedListItem from '../../libs/components/common/AnimatedListItem';

export const getStaticProps = async ({ locale }: any) => ({
	props: {
		...(await serverSideTranslations(locale, ['common'])),
	},
});

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
	const device = useDeviceDetect();
	const router = useRouter();
	const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
		router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
	);
	const [properties, setProperties] = useState<Property[]>([]);
	const [total, setTotal] = useState<number>(0);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [sortingOpen, setSortingOpen] = useState(false);
	const [filterSortName, setFilterSortName] = useState('New');

	/** APOLLO REQUESTS **/
	const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

	const {
		loading: getPropertiesLoading,
		data: getPropertiesData,
		error: getPropertiesError,
		refetch: getPropertiesRefetch,
	} = useQuery(GET_PROPERTIES, {
		fetchPolicy: 'network-only',
		variables: { input: searchFilter },
		notifyOnNetworkStatusChange: true,
		onCompleted: (data: T) => {
			setProperties(data?.getProperties?.list);
			setTotal(data?.getProperties?.metaCounter[0]?.total);
		},
	});
	/** LIFECYCLES **/
	useEffect(() => {
		// Scroll to top when page mounts
		if (typeof window !== 'undefined') {
			window.scrollTo({
				top: 0,
				left: 0,
				behavior: 'auto',
			});
			document.documentElement.scrollTop = 0;
			document.body.scrollTop = 0;
		}
	}, []);

	useEffect(() => {
		if (router.query.input) {
			const inputObj = JSON.parse(router?.query?.input as string);
			setSearchFilter(inputObj);
		}

		setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
	}, [router]);

	useEffect(() => {
		getPropertiesRefetch({ input: searchFilter }).then();
	}, [searchFilter]);

	/** HANDLERS **/
	const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
		searchFilter.page = value;
		await router.push(
			`/property?input=${JSON.stringify(searchFilter)}`,
			`/property?input=${JSON.stringify(searchFilter)}`,
			{
				scroll: false,
			},
		);
		setCurrentPage(value);
	};

	const likePropertyHandler = async (user: T, id: string) => {
		try {
			//execute likePropertyHandler Mutation
			if (!id) return;
			if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
			await likeTargetProperty({
				variables: { input: id },
			});
			//execute getPropertiesRefetch
			await getPropertiesRefetch({ input: initialInput });

			await sweetTopSmallSuccessAlert('success', 800);
		} catch (err: any) {
			console.log('Error:likePropertyHandler', err.message);
			sweetMixinErrorAlert(err.message).then();
		}
	};

	const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
		setAnchorEl(e.currentTarget);
		setSortingOpen(true);
	};

	const sortingCloseHandler = () => {
		setSortingOpen(false);
		setAnchorEl(null);
	};

	const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
		switch (e.currentTarget.id) {
			case 'new':
				setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
				setFilterSortName('New');
				break;
			case 'lowest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.ASC });
				setFilterSortName('Lowest Price');
				break;
			case 'highest':
				setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.DESC });
				setFilterSortName('Highest Price');
		}
		setSortingOpen(false);
		setAnchorEl(null);
	};

	if (device === 'mobile') {
		return (
			<Stack sx={{ p: 2, minHeight: '100vh' }}>
				{/* Filter */}
				<Stack sx={{ mb: 2 }}>
					{/* @ts-ignore */}
					<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
				</Stack>

				{/* Properties List */}
				<Stack spacing={2} sx={{ mb: 4 }}>
					{properties?.length === 0 ? (
						<Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
							<img src="/img/icons/icoAlert.svg" alt="" style={{ width: 64, height: 64, marginBottom: 16 }} />
							<Typography sx={{ fontSize: 16, fontWeight: 600, color: '#6b7280' }}>No Hotels found!</Typography>
						</Stack>
					) : (
						properties.map((property: Property, index: number) => {
							return (
								<AnimatedListItem key={property?._id} index={index} delayMultiplier={0.08}>
									<PropertyCard property={property} likePropertyHandler={likePropertyHandler} />
								</AnimatedListItem>
							);
						})
					)}
				</Stack>

				{/* Pagination */}
				{properties.length !== 0 && (
					<Stack spacing={2} sx={{ mb: 4, alignItems: 'center' }}>
						<Pagination
							page={currentPage}
							count={Math.ceil(total / searchFilter.limit)}
							onChange={handlePaginationChange}
							shape="circular"
							color="primary"
							size="small"
						/>
						<Typography sx={{ fontSize: 12, color: '#6b7280', textAlign: 'center' }}>
							Total {total} hotel{total > 1 ? 's' : ''} available
						</Typography>
					</Stack>
				)}
			</Stack>
		);
	} else {
		return (
			<div id="property-list-page" style={{ position: 'relative' }}>
				<div className="container">
					{/* Sort by dropdown removed as requested */}
					<Stack className={'property-page'}>
						<AnimatedSection animationType="slide-left" animationDelay={0.1}>
							<Stack className={'filter-config'}>
								{/* @ts-ignore */}
								<Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
							</Stack>
						</AnimatedSection>
						<Stack className="main-config" mb={'76px'}>
							<Stack className={'list-config'}>
								{properties?.length === 0 ? (
									<AnimatedSection animationType="fade-in" animationDelay={0.2}>
										<div className={'no-data'}>
											<img src="/img/icons/icoAlert.svg" alt="" />
											<p>No Hotels found!</p>
										</div>
									</AnimatedSection>
								) : (
									properties.map((property: Property, index: number) => {
										return (
											<AnimatedListItem key={property?._id} index={index} delayMultiplier={0.08}>
												<PropertyCard property={property} likePropertyHandler={likePropertyHandler} />
											</AnimatedListItem>
										);
									})
								)}
							</Stack>
							<AnimatedSection animationType="fade-up" animationDelay={0.3}>
								<Stack className="pagination-config">
									{properties.length !== 0 && (
										<Stack className="pagination-box">
											<Pagination
												page={currentPage}
												count={Math.ceil(total / searchFilter.limit)}
												onChange={handlePaginationChange}
												shape="circular"
												color="primary"
											/>
										</Stack>
									)}

									{properties.length !== 0 && (
										<Stack className="total-result">
											<Typography>
												Total {total} hotel{total > 1 ? 's' : ''} available
											</Typography>
										</Stack>
									)}
								</Stack>
							</AnimatedSection>
						</Stack>
					</Stack>
				</div>
			</div>
		);
	}
};

PropertyList.defaultProps = {
	initialInput: {
		page: 1,
		limit: 9,
		sort: 'createdAt',
		direction: 'DESC',
		search: {
			pricesRange: {
				start: 0,
				end: 2000000,
			},
		},
	},
};

export default withLayoutBasic(PropertyList);
