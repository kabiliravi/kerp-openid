/*******************************************************************************
 * Copyright 2018 The MIT Internet Trust Consortium
 *
 * Portions copyright 2011-2013 The MITRE Corporation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/
/**
 *
 */
package org.mitre.openid.connect.model;

import java.util.UUID;

import javax.persistence.Basic;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.Table;

/**
 *
 * Holds the generated pairwise identifiers for a user. Can be tied to either a client ID or a sector identifier URL.
 *
 * @author jricher
 *
 */
@Entity
@Table(name = "pairwise_identifier")
@NamedQueries({
	@NamedQuery(name=PairwiseIdentifier.QUERY_ALL, query = "select p from PairwiseIdentifier p where u.hostUuid = :hostUuid"),
	@NamedQuery(name=PairwiseIdentifier.QUERY_BY_SECTOR_IDENTIFIER, query = "select p from PairwiseIdentifier p WHERE u.hostUuid = :hostUuid and p.userSub = :" + PairwiseIdentifier.PARAM_SUB + " AND p.sectorIdentifier = :" + PairwiseIdentifier.PARAM_SECTOR_IDENTIFIER)
})
public class PairwiseIdentifier {

	public static final String QUERY_BY_SECTOR_IDENTIFIER = "PairwiseIdentifier.getBySectorIdentifier";
	public static final String QUERY_ALL = "PairwiseIdentifier.getAll";

	public static final String PARAM_SECTOR_IDENTIFIER = "sectorIdentifier";
	public static final String PARAM_SUB = "sub";

	private String uuid;
	private String hostUuid;
	private String identifier;
	private String userSub;
	private String sectorIdentifier;

	public PairwiseIdentifier() {
		this.uuid = UUID.randomUUID().toString();
	}
	
	public PairwiseIdentifier(String uuid) {
		this.uuid = uuid;
	}	
	
	@Id
	@Column(name = "uuid")	
	public String getUuid() {
		return uuid;
	}

	public void setUuid(String uuid) {
		this.uuid = uuid;
	}

	@Basic
	@Column(name = "host_uuid")
	public String getHostUuid() {
		return hostUuid;
	}

	public void setHostUuid(String hostUuid) {
		this.hostUuid = hostUuid;
	}

	/**
	 * @return the identifier
	 */
	@Basic
	@Column(name = "identifier")
	public String getIdentifier() {
		return identifier;
	}

	/**
	 * @param identifier the identifier to set
	 */
	public void setIdentifier(String identifier) {
		this.identifier = identifier;
	}

	/**
	 * @return the userSub
	 */
	@Basic
	@Column(name = PairwiseIdentifier.PARAM_SUB)
	public String getUserSub() {
		return userSub;
	}

	/**
	 * @param userSub the userSub to set
	 */
	public void setUserSub(String userSub) {
		this.userSub = userSub;
	}

	/**
	 * @return the sectorIdentifier
	 */
	@Basic
	@Column(name = "sector_identifier")
	public String getSectorIdentifier() {
		return sectorIdentifier;
	}

	/**
	 * @param sectorIdentifier the sectorIdentifier to set
	 */
	public void setSectorIdentifier(String sectorIdentifier) {
		this.sectorIdentifier = sectorIdentifier;
	}
}
