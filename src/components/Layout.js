import { useState, useEffect } from "react";
import { Frame, SkeletonPage, Layout, Card, TextContainer, SkeletonDisplayText, SkeletonBodyText } from "@shopify/polaris";
import Header from "@components/Header";
import Sidebar from "@components/sidebar/Sidebar";
import SimpleContent from "@components/SimpleContent";


function PrivateLayout() {
	const [isLoading, setIsLoading] = useState(true);

	const loadingPageMarkup = (
		<SkeletonPage>
		<Layout>
			<Layout.Section>
			<Card sectioned>
				<TextContainer>
				<SkeletonDisplayText size="small" />
				<SkeletonBodyText lines={9} />
				</TextContainer>
			</Card>
			</Layout.Section>
		</Layout>
		</SkeletonPage>
	);

	const loadingNavigationMarkup = (
		<div style={{minWidth: '18.5rem'}}>
			<SkeletonPage>
				<Layout>
					<Layout.Section>
						<Card sectioned>
							<TextContainer>
								<SkeletonDisplayText size="small" />
								<SkeletonBodyText lines={9} />
							</TextContainer>
						</Card>
						<Card sectioned>
							<TextContainer>
								<SkeletonDisplayText size="small" />
								<SkeletonBodyText lines={9} />
							</TextContainer>
						</Card>
					</Layout.Section>
				</Layout>
			</SkeletonPage>
		</div>
	);

	/*
	const actualPageMarkup = (
		<Content/>
	);
	*/
	
	const actualPageMarkup = (
		<SimpleContent/>
	);

	const actualNavigationMarkup = (
	    <Sidebar />
	);
    
  
  	const pageMarkup = isLoading ? loadingPageMarkup : actualPageMarkup;
  	const navigationMarkup = isLoading ? loadingNavigationMarkup : actualNavigationMarkup;

	useEffect(() => {
		setIsLoading(true);

		//console.log('Hello From UseEffect!');

		setTimeout(() => {
			return setIsLoading(false);
		}, 500);
	}, []);
  
	
    return (
        <Frame
            topBar={<Header />}
            navigation={navigationMarkup}
        >
            {pageMarkup}
        </Frame>
      );
}
export default PrivateLayout;